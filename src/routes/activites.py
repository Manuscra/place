import requests
from flask import Blueprint, Response, jsonify, request

from ..database import db
from ..models import Activite, ActAttrib, AttribChap, AttribNiv, Chap, Etiquette, Img, Lien, Liste, Niveau, Reponse, TypeActivite
from ..schemas.activite import ActiviteCreate, ActiviteOut, ActiviteUpdate, ImgCreate, ImgOut, ImgUpdate, LienCreate, LienOut, LienUpdate, ChapCreate, ChapOut, ChapUpdate, NiveauCreate, NiveauOut, NiveauUpdate, ReponseCreate, ReponseOut, ReponseUpdate, AttribNivOut

activites_bp = Blueprint("activites", __name__, url_prefix="/api/activites")


# =============================================================================
# Activite CRUD
# =============================================================================

def _enrich_activite(act):
    d = ActiviteOut.model_validate(act).model_dump()
    if act.No_dImg and act.No_dImg != 0:
        img = db.session.get(Img, act.No_dImg)
        d["img_name"] = img.N_Img if img else None
    if act.Type_Act == 2:
        lien = Lien.query.filter_by(No_dAct=act.No_Act).first()
        d["lien_url"] = lien.Link if lien else None
    chaps = AttribChap.query.filter_by(No_dAct=act.No_Act).all()
    d["chapitre_names"] = []
    for ac in chaps:
        chap = db.session.get(Chap, ac.No_dChap)
        if chap:
            d["chapitre_names"].append(chap.Name_Chap)
    # Act_Attrib.No_Niv_Attrib references Niveau.No_Niv directly (legacy naming)
    nivs = ActAttrib.query.filter_by(No_Act_Attrib=act.No_Act).all()
    d["niveau_names"] = []
    for an in nivs:
        niv = db.session.get(Niveau, an.No_Niv_Attrib)
        if niv:
            d["niveau_names"].append(niv.Name_Niv)
    return d


@activites_bp.route("", methods=["GET"])
def list_activites():
    activites = Activite.query.order_by(Activite.Type_Act, Activite.Name_Act).all()
    return jsonify([_enrich_activite(a) for a in activites])


@activites_bp.route("/export-csv", methods=["GET"])
def export_activites_csv():
    import csv
    import io

    activites = Activite.query.order_by(Activite.Type_Act, Activite.Name_Act).all()
    rows = [_enrich_activite(a) for a in activites]

    output = io.StringIO()
    output.write("\ufeff")  # BOM for Excel
    writer = csv.writer(output)
    writer.writerow(["ID", "Nom", "Type", "Image", "Lien", "Chapitres", "Niveaux"])
    for a in rows:
        type_label = "Quizz" if a.get("Type_Act") == 1 else "Lien"
        writer.writerow([
            a.get("No_Act", ""),
            a.get("Name_Act", ""),
            type_label,
            a.get("img_name") or "",
            a.get("lien_url") or "",
            ", ".join(a.get("chapitre_names") or []),
            ", ".join(a.get("niveau_names") or []),
        ])

    csv_data = output.getvalue()
    output.close()

    return Response(
        csv_data,
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment; filename=activites.csv"},
    )


@activites_bp.route("/<int:activite_id>", methods=["GET"])
def get_activite(activite_id):
    a = db.session.get(Activite, activite_id)
    if not a:
        return jsonify({"error": "Activite not found"}), 404
    return jsonify(_enrich_activite(a))


@activites_bp.route("", methods=["POST"])
def create_activite():
    data = ActiviteCreate.model_validate(request.get_json(silent=True) or {})
    a = Activite(Name_Act=data.Name_Act, Type_Act=data.Type_Act, No_dImg=data.No_dImg)
    db.session.add(a)
    db.session.commit()
    return jsonify(_enrich_activite(a)), 201


@activites_bp.route("/<int:activite_id>", methods=["PUT"])
def update_activite(activite_id):
    a = db.session.get(Activite, activite_id)
    if not a:
        return jsonify({"error": "Activite not found"}), 404
    data = ActiviteUpdate.model_validate(request.get_json(silent=True) or {})
    for key, val in data.model_dump(exclude_unset=True).items():
        setattr(a, key, val)
    db.session.commit()
    return jsonify(_enrich_activite(a))


@activites_bp.route("/<int:activite_id>", methods=["DELETE"])
def delete_activite(activite_id):
    a = db.session.get(Activite, activite_id)
    if not a:
        return jsonify({"error": "Activite not found"}), 404
    Lien.query.filter_by(No_dAct=activite_id).delete()
    db.session.delete(a)
    db.session.commit()
    return jsonify({"message": "Activite deleted"}), 200


# =============================================================================
# Images
# =============================================================================

@activites_bp.route("/images", methods=["GET"])
def list_images():
    imgs = Img.query.order_by(Img.No_Img).all()
    return jsonify([ImgOut.model_validate(i).model_dump() for i in imgs])


@activites_bp.route("/images", methods=["POST"])
def create_image():
    data = ImgCreate.model_validate(request.get_json(silent=True) or {})
    img = Img(N_Img=data.N_Img)
    db.session.add(img)
    db.session.commit()
    return jsonify(ImgOut.model_validate(img).model_dump()), 201


@activites_bp.route("/images/<int:img_id>", methods=["PUT"])
def update_image(img_id):
    img = db.session.get(Img, img_id)
    if not img:
        return jsonify({"error": "Image not found"}), 404
    data = ImgUpdate.model_validate(request.get_json(silent=True) or {})
    for key, val in data.model_dump(exclude_unset=True).items():
        setattr(img, key, val)
    db.session.commit()
    return jsonify(ImgOut.model_validate(img).model_dump())


@activites_bp.route("/images/<int:img_id>", methods=["DELETE"])
def delete_image(img_id):
    img = db.session.get(Img, img_id)
    if not img:
        return jsonify({"error": "Image not found"}), 404
    db.session.delete(img)
    db.session.commit()
    return jsonify({"message": "Image deleted"}), 200


def _enrich_lien(ln):
    d = LienOut.model_validate(ln).model_dump()
    if ln.No_dAct and ln.No_dAct != 0:
        act = db.session.get(Activite, ln.No_dAct)
        d["act_name"] = act.Name_Act if act else None
    return d


# =============================================================================
# Liens
# =============================================================================

@activites_bp.route("/liens", methods=["GET"])
def list_liens():
    liens = Lien.query.order_by(Lien.No_Lien).all()
    return jsonify([_enrich_lien(ln) for ln in liens])


@activites_bp.route("/liens", methods=["POST"])
def create_lien():
    data = LienCreate.model_validate(request.get_json(silent=True) or {})
    lien = Lien(Link=data.Link)
    db.session.add(lien)
    db.session.commit()
    return jsonify(_enrich_lien(lien)), 201


@activites_bp.route("/liens/<int:lien_id>", methods=["PUT"])
def update_lien(lien_id):
    lien = db.session.get(Lien, lien_id)
    if not lien:
        return jsonify({"error": "Lien not found"}), 404
    data = LienUpdate.model_validate(request.get_json(silent=True) or {})
    for key, val in data.model_dump(exclude_unset=True).items():
        setattr(lien, key, val)
    db.session.commit()
    return jsonify(_enrich_lien(lien))


@activites_bp.route("/liens/<int:lien_id>", methods=["DELETE"])
def delete_lien(lien_id):
    lien = db.session.get(Lien, lien_id)
    if not lien:
        return jsonify({"error": "Lien not found"}), 404
    db.session.delete(lien)
    db.session.commit()
    return jsonify({"message": "Lien deleted"}), 200


# =============================================================================
# Chapitres
# =============================================================================

@activites_bp.route("/chapitres", methods=["GET"])
def list_chapitres():
    chaps = Chap.query.order_by(Chap.No_chap).all()
    return jsonify([ChapOut.model_validate(c).model_dump() for c in chaps])


@activites_bp.route("/chapitres", methods=["POST"])
def create_chapitre():
    data = ChapCreate.model_validate(request.get_json(silent=True) or {})
    chap = Chap(Name_Chap=data.Name_Chap)
    db.session.add(chap)
    db.session.commit()
    return jsonify(ChapOut.model_validate(chap).model_dump()), 201


@activites_bp.route("/chapitres/<int:chap_id>", methods=["PUT"])
def update_chapitre(chap_id):
    chap = db.session.get(Chap, chap_id)
    if not chap:
        return jsonify({"error": "Chapitre not found"}), 404
    data = ChapUpdate.model_validate(request.get_json(silent=True) or {})
    for key, val in data.model_dump(exclude_unset=True).items():
        setattr(chap, key, val)
    db.session.commit()
    return jsonify(ChapOut.model_validate(chap).model_dump())


@activites_bp.route("/chapitres/<int:chap_id>", methods=["DELETE"])
def delete_chapitre(chap_id):
    chap = db.session.get(Chap, chap_id)
    if not chap:
        return jsonify({"error": "Chapitre not found"}), 404
    db.session.delete(chap)
    db.session.commit()
    return jsonify({"message": "Chapitre deleted"}), 200


# =============================================================================
# Niveaux
# =============================================================================

@activites_bp.route("/niveaux", methods=["GET"])
def list_niveaux():
    niveaux = Niveau.query.order_by(Niveau.No_Niv).all()
    return jsonify([NiveauOut.model_validate(n).model_dump() for n in niveaux])


@activites_bp.route("/niveaux", methods=["POST"])
def create_niveau():
    data = NiveauCreate.model_validate(request.get_json(silent=True) or {})
    niv = Niveau(
        Name_Niv=data.Name_Niv,
        qcm_active=data.qcm_active if data.qcm_active is not None else 1,
        qcm_bg=data.qcm_bg,
        qcm_theme=data.qcm_theme,
    )
    db.session.add(niv)
    db.session.commit()
    return jsonify(NiveauOut.model_validate(niv).model_dump()), 201


@activites_bp.route("/niveaux/<int:niv_id>", methods=["PUT"])
def update_niveau(niv_id):
    niv = db.session.get(Niveau, niv_id)
    if not niv:
        return jsonify({"error": "Niveau not found"}), 404
    data = NiveauUpdate.model_validate(request.get_json(silent=True) or {})
    for key, val in data.model_dump(exclude_unset=True).items():
        setattr(niv, key, val)
    db.session.commit()
    return jsonify(NiveauOut.model_validate(niv).model_dump())


@activites_bp.route("/niveaux/<int:niv_id>", methods=["DELETE"])
def delete_niveau(niv_id):
    niv = db.session.get(Niveau, niv_id)
    if not niv:
        return jsonify({"error": "Niveau not found"}), 404
    db.session.delete(niv)
    db.session.commit()
    return jsonify({"message": "Niveau deleted"}), 200


# =============================================================================
# Reponses
# =============================================================================

@activites_bp.route("/reponses", methods=["GET"])
def list_reponses():
    reps = Reponse.query.order_by(Reponse.Reponse).all()
    return jsonify([ReponseOut.model_validate(r).model_dump() for r in reps])


@activites_bp.route("/reponses", methods=["POST"])
def create_reponse():
    data = ReponseCreate.model_validate(request.get_json(silent=True) or {})
    rep = Reponse(Reponse=data.Reponse)
    db.session.add(rep)
    db.session.commit()
    return jsonify(ReponseOut.model_validate(rep).model_dump()), 201


@activites_bp.route("/reponses/<int:rep_id>", methods=["PUT"])
def update_reponse(rep_id):
    rep = db.session.get(Reponse, rep_id)
    if not rep:
        return jsonify({"error": "Reponse not found"}), 404
    data = ReponseUpdate.model_validate(request.get_json(silent=True) or {})
    for key, val in data.model_dump(exclude_unset=True).items():
        setattr(rep, key, val)
    db.session.commit()
    return jsonify(ReponseOut.model_validate(rep).model_dump())


@activites_bp.route("/reponses/<int:rep_id>", methods=["DELETE"])
def delete_reponse(rep_id):
    rep = db.session.get(Reponse, rep_id)
    if not rep:
        return jsonify({"error": "Reponse not found"}), 404
    db.session.delete(rep)
    db.session.commit()
    return jsonify({"message": "Reponse deleted"}), 200


# =============================================================================
# Types
# =============================================================================

@activites_bp.route("/types", methods=["GET"])
def list_types():
    from ..schemas.activite import TypeActiviteOut
    types = TypeActivite.query.order_by(TypeActivite.No_Type).all()
    return jsonify([TypeActiviteOut.model_validate(t).model_dump() for t in types])


# =============================================================================
# Attribution: Activite <-> Chap
# =============================================================================

@activites_bp.route("/attrib/chap", methods=["GET"])
def list_attrib_chap():
    rows = AttribChap.query.order_by(AttribChap.No_Attrib).all()
    out = []
    for r in rows:
        d = {"No_Attrib": r.No_Attrib, "No_dChap": r.No_dChap, "No_dAct": r.No_dAct}
        chap = db.session.get(Chap, r.No_dChap)
        d["chap_name"] = chap.Name_Chap if chap else None
        out.append(d)
    return jsonify(out)


@activites_bp.route("/attrib/chap", methods=["POST"])
def sync_attrib_chap():
    """Receive {activite_id, chapitre_ids: [int]} OR {matrix: [{activite_id, chapitre_ids}]} and sync Attrib_Chap."""
    data = request.get_json(silent=True) or {}

    # Matrix mode
    if "matrix" in data:
        all_pairs = set()
        for entry in data["matrix"]:
            act_id = entry.get("activite_id")
            chap_ids = entry.get("chapitre_ids", [])
            for cid in chap_ids:
                all_pairs.add((act_id, cid))

        existing_all = AttribChap.query.all()
        existing_pairs = {(r.No_dAct, r.No_dChap): r for r in existing_all}

        to_add = all_pairs - set(existing_pairs.keys())
        to_del = set(existing_pairs.keys()) - all_pairs

        for (aid, cid) in to_del:
            r = existing_pairs.get((aid, cid))
            if r:
                db.session.delete(r)
        for (aid, cid) in to_add:
            db.session.add(AttribChap(No_dAct=aid, No_dChap=cid))
        db.session.commit()
        return jsonify({"message": "Attributions updated"}), 200

    # Single mode
    act_id = data.get("activite_id")
    chap_ids = set(data.get("chapitre_ids", []))
    if not act_id:
        return jsonify({"error": "activite_id required"}), 400

    existing = AttribChap.query.filter_by(No_dAct=act_id).all()
    existing_ids = {r.No_dChap for r in existing}
    to_add = chap_ids - existing_ids
    to_del = existing_ids - chap_ids

    for cid in to_del:
        r = AttribChap.query.filter_by(No_dAct=act_id, No_dChap=cid).first()
        if r:
            db.session.delete(r)
    for cid in to_add:
        db.session.add(AttribChap(No_dAct=act_id, No_dChap=cid))
    db.session.commit()
    return jsonify({"message": "Attributions updated"}), 200


# =============================================================================
# Attribution: Activite <-> Niveau (via Act_Attrib)
# =============================================================================

@activites_bp.route("/attrib/niveau", methods=["GET"])
def list_attrib_niveau():
    acts = ActAttrib.query.order_by(ActAttrib.pk).all()
    out = []
    for a in acts:
        d = {"pk": a.pk, "No_Niv_Attrib": a.No_Niv_Attrib, "No_Act_Attrib": a.No_Act_Attrib}
        # No_Niv_Attrib references Niveau.No_Niv directly
        niv = db.session.get(Niveau, a.No_Niv_Attrib)
        d["No_dNiv"] = a.No_Niv_Attrib
        d["niv_name"] = niv.Name_Niv if niv else None
        out.append(d)
    return jsonify(out)


@activites_bp.route("/attrib/niveau", methods=["POST"])
def sync_attrib_niveau():
    """Receive {activite_id, attrib_niv_ids: [int]} OR {matrix: [{activite_id, niveau_ids}]} and sync Act_Attrib."""
    data = request.get_json(silent=True) or {}

    # Matrix mode: activities × niveaux matrix
    if "matrix" in data:
        all_pairs = set()
        for entry in data["matrix"]:
            act_id = entry.get("activite_id")
            niv_ids = entry.get("niveau_ids", [])
            for nid in niv_ids:
                # Act_Attrib.No_Niv_Attrib references Niveau.No_Niv directly
                all_pairs.add((act_id, nid))

        existing_all = ActAttrib.query.all()
        existing_pairs = {(r.No_Act_Attrib, r.No_Niv_Attrib): r for r in existing_all}

        to_add = all_pairs - set(existing_pairs.keys())
        to_del = set(existing_pairs.keys()) - all_pairs

        for (aid, anid) in to_del:
            r = existing_pairs.get((aid, anid))
            if r:
                db.session.delete(r)
        for (aid, anid) in to_add:
            db.session.add(ActAttrib(No_Act_Attrib=aid, No_Niv_Attrib=anid))
        db.session.commit()
        return jsonify({"message": "Attributions updated"}), 200

    # Single mode: one activite -> attrib_niv ids
    act_id = data.get("activite_id")
    aniv_ids = set(data.get("attrib_niv_ids", []))
    if not act_id:
        return jsonify({"error": "activite_id required"}), 400

    existing = ActAttrib.query.filter_by(No_Act_Attrib=act_id).all()
    existing_ids = {r.No_Niv_Attrib for r in existing}
    to_add = aniv_ids - existing_ids
    to_del = existing_ids - aniv_ids

    for aid in to_del:
        r = ActAttrib.query.filter_by(No_Act_Attrib=act_id, No_Niv_Attrib=aid).first()
        if r:
            db.session.delete(r)
    for aid in to_add:
        db.session.add(ActAttrib(No_Act_Attrib=act_id, No_Niv_Attrib=aid))
    db.session.commit()
    return jsonify({"message": "Attributions updated"}), 200


# =============================================================================
# Attribution: Chap <-> Niveau (Attrib_Niv)
# =============================================================================

@activites_bp.route("/attrib/chap-niv", methods=["GET"])
def list_attrib_chap_niv():
    rows = AttribNiv.query.order_by(AttribNiv.No_Niv_Attrib).all()
    out = []
    for r in rows:
        d = AttribNivOut.model_validate(r).model_dump()
        chap = db.session.get(Chap, r.No_dChap)
        niv = db.session.get(Niveau, r.No_dNiv)
        d["chap_name"] = chap.Name_Chap if chap else None
        d["niv_name"] = niv.Name_Niv if niv else None
        out.append(d)
    return jsonify(out)


@activites_bp.route("/attrib/chap-niv", methods=["POST"])
def sync_attrib_chap_niv():
    """Receive {chapitre_id, niveau_ids: [int]} OR {matrix: [{chapitre_id, niveau_ids}]} and sync Attrib_Niv."""
    data = request.get_json(silent=True) or {}

    # Batch mode: matrix of chapter->level associations
    if "matrix" in data:
        all_pairs = set()
        for entry in data["matrix"]:
            chap_id = entry.get("chapitre_id")
            niv_ids = entry.get("niveau_ids", [])
            for nid in niv_ids:
                all_pairs.add((chap_id, nid))

        existing_all = AttribNiv.query.all()
        existing_pairs = {(r.No_dChap, r.No_dNiv): r for r in existing_all}

        to_add = all_pairs - set(existing_pairs.keys())
        to_del = set(existing_pairs.keys()) - all_pairs

        for (cid, nid) in to_del:
            r = existing_pairs.get((cid, nid))
            if r:
                db.session.delete(r)
        for (cid, nid) in to_add:
            db.session.add(AttribNiv(No_dChap=cid, No_dNiv=nid))
        db.session.commit()
        return jsonify({"message": "Attributions updated"}), 200

    # Single mode: one chapter -> multiple levels
    chap_id = data.get("chapitre_id")
    niv_ids = set(data.get("niveau_ids", []))
    if not chap_id:
        return jsonify({"error": "chapitre_id required"}), 400

    existing = AttribNiv.query.filter_by(No_dChap=chap_id).all()
    existing_ids = {r.No_dNiv for r in existing}
    to_add = niv_ids - existing_ids
    to_del = existing_ids - niv_ids

    for nid in to_del:
        r = AttribNiv.query.filter_by(No_dChap=chap_id, No_dNiv=nid).first()
        if r:
            db.session.delete(r)
    for nid in to_add:
        db.session.add(AttribNiv(No_dChap=chap_id, No_dNiv=nid))
    db.session.commit()
    return jsonify({"message": "Attributions updated"}), 200


# =============================================================================
# Assoc Type: Set activity type and associate image or link
# =============================================================================

@activites_bp.route("/assoc-type", methods=["POST"])
def assoc_type():
    """Receive {No_Act, Type_Act, No_dImg, No_Lien, Link}."""
    data = request.get_json(silent=True) or {}
    act_id = data.get("No_Act")
    type_act = data.get("Type_Act")
    if not act_id or type_act not in (1, 2):
        return jsonify({"error": "No_Act and Type_Act (1 or 2) required"}), 400

    act = db.session.get(Activite, act_id)
    if not act:
        return jsonify({"error": "Activite not found"}), 404

    act.Type_Act = type_act
    if type_act == 1:
        act.No_dImg = data.get("No_dImg", 0)
        Lien.query.filter_by(No_dAct=act_id).update({"No_dAct": 0})
    else:
        act.No_dImg = 0
        lien_id = data.get("No_Lien")
        if lien_id:
            Lien.query.filter_by(No_dAct=act_id).update({"No_dAct": 0})
            lien = db.session.get(Lien, lien_id)
            if lien:
                lien.No_dAct = act_id
        else:
            link_url = data.get("Link")
            if link_url:
                Lien.query.filter_by(No_dAct=act_id).update({"No_dAct": 0})
                db.session.add(Lien(Link=link_url, No_dAct=act_id))

    db.session.commit()
    return jsonify(_enrich_activite(act))


# =============================================================================
# Image proxy (fetch from production server since images are not stored locally)
# =============================================================================

PROD_IMAGE_BASE = "https://duss.alwaysdata.net/qcm/image.php"


@activites_bp.route("/image-proxy/<code>", methods=["GET"])
def image_proxy(code):
    """Proxy activity images from the production server or direct URLs."""
    try:
        if code.startswith("http://") or code.startswith("https://"):
            url = code
        else:
            url = f"{PROD_IMAGE_BASE}?img={code}"
        resp = requests.get(url, timeout=10)
        resp.raise_for_status()
        return Response(resp.content, content_type=resp.headers.get("content-type", "image/png"))
    except requests.RequestException:
        return jsonify({"error": "Image not available"}), 404


# =============================================================================
# Positionnement : drag-and-drop label positioning on quiz images
# =============================================================================

@activites_bp.route("/positionnement/<int:act_id>", methods=["GET"])
def get_positionnement(act_id):
    """Return activity image + labels data for the positioning page."""
    act = db.session.get(Activite, act_id)
    if not act or act.Type_Act != 1:
        return jsonify({"error": "Activite not found or not a quiz"}), 404

    img_row = db.session.get(Img, act.No_dImg) if act.No_dImg else None
    img_url = img_row.N_Img if img_row else ""

    lists = Liste.query.filter_by(Act_liste=act_id).order_by(Liste.Num_Liste_Act, Liste.No_Liste).all()

    labels = []
    for lst in lists:
        rep = db.session.get(Reponse, lst.Num_Rep)
        rep_text = rep.Reponse if rep else "?"
        etiqs = Etiquette.query.filter_by(No_liste=lst.No_Liste).order_by(Etiquette.No_Etiqu).all()
        for eq in etiqs:
            labels.append({
                "id": eq.No_Etiqu,
                "text": rep_text,
                "x": eq.x,
                "y": eq.y,
            })

    return jsonify({
        "name": act.Name_Act,
        "img_url": img_url,
        "labels": labels,
    })


@activites_bp.route("/positionnement", methods=["POST"])
def save_positionnement():
    """Save label positions after drag-and-drop. Body: [{id, x, y}, ...]."""
    data = request.get_json(silent=True) or []
    for item in data:
        etiq = db.session.get(Etiquette, item.get("id"))
        if etiq:
            etiq.x = int(float(item.get("x", etiq.x)))
            etiq.y = int(float(item.get("y", etiq.y)))
    db.session.commit()
    return jsonify({"message": "Positions saved"}), 200


@activites_bp.route("/positionnement/activities", methods=["GET"])
def list_quiz_activites():
    """Return all quiz-type activities for the positionnement dropdown."""
    acts = Activite.query.filter_by(Type_Act=1).order_by(Activite.Name_Act).all()
    return jsonify([{"No_Act": a.No_Act, "Name_Act": a.Name_Act} for a in acts])


# =============================================================================
# Listes : response lists for quiz activities (quiz builder)
# =============================================================================

@activites_bp.route("/listes/<int:act_id>", methods=["GET"])
def get_listes(act_id):
    """Return existing lists + responses for an activity, grouped by Num_Liste_Act."""
    act = db.session.get(Activite, act_id)
    if not act:
        return jsonify({"error": "Activite not found"}), 404

    rows = Liste.query.filter_by(Act_liste=act_id).order_by(Liste.Num_Liste_Act, Liste.No_Liste).all()

    lists = {}
    for r in rows:
        key = r.Num_Liste_Act
        if key not in lists:
            lists[key] = []
        rep = db.session.get(Reponse, r.Num_Rep)
        etiqs = Etiquette.query.filter_by(No_liste=r.No_Liste).all()
        lists[key].append({
            "No_Liste": r.No_Liste,
            "No_Rep": r.Num_Rep,
            "Reponse": rep.Reponse if rep else "?",
            "nb_etiq": len(etiqs) or 1,
        })

    result = []
    for k in sorted(lists.keys()):
        result.append({"num": k, "reponses": lists[k]})

    return jsonify({
        "No_Act": act.No_Act,
        "Name_Act": act.Name_Act,
        "lists": result,
    })


@activites_bp.route("/listes", methods=["POST"])
def save_listes():
    """
    Save lists + etiquettes for an activity.
    Body: {act_id, lists: [{reponses: [{No_Rep, nb_etiq}]}]}
    Each entry in 'lists' becomes a Num_Liste_Act group.
    """
    data = request.get_json(silent=True) or {}
    act_id = data.get("act_id")
    if not act_id:
        return jsonify({"error": "act_id required"}), 400

    act = db.session.get(Activite, act_id)
    if not act:
        return jsonify({"error": "Activite not found"}), 404

    # Delete existing lists + etiquettes for this activity
    old_lists = Liste.query.filter_by(Act_liste=act_id).all()
    old_ids = [lst.No_Liste for lst in old_lists]
    if old_ids:
        Etiquette.query.filter(Etiquette.No_liste.in_(old_ids)).delete(synchronize_session=False)
        Liste.query.filter_by(Act_liste=act_id).delete()

    # Get global max Num_Liste_Base (or start at 0 if empty)
    max_base = db.session.query(db.func.max(Liste.Num_Liste_Base)).scalar() or -1
    next_base = max_base + 1

    lists_data = data.get("lists", [])
    for i, lst in enumerate(lists_data):
        base_num = next_base + i
        for rep in lst.get("reponses", []):
            new_liste = Liste(
                Act_liste=act_id,
                Num_Liste_Base=base_num,
                Num_Liste_Act=i,
                Num_Rep=rep["No_Rep"],
            )
            db.session.add(new_liste)
            db.session.flush()  # get No_Liste

            nb = max(1, int(rep.get("nb_etiq", 1)))
            for k in range(nb):
                db.session.add(Etiquette(
                    x=50,
                    y=k * 30,
                    No_liste=new_liste.No_Liste,
                ))

    db.session.commit()
    return jsonify({"message": "Listes saved"}), 200


@activites_bp.route("/listes/<int:act_id>", methods=["DELETE"])
def delete_listes(act_id):
    """Delete all lists + etiquettes for an activity."""
    old_lists = Liste.query.filter_by(Act_liste=act_id).all()
    old_ids = [lst.No_Liste for lst in old_lists]
    if old_ids:
        Etiquette.query.filter(Etiquette.No_liste.in_(old_ids)).delete(synchronize_session=False)
        Liste.query.filter_by(Act_liste=act_id).delete()
        db.session.commit()
    return jsonify({"message": "Listes deleted"}), 200


# =============================================================================
# Niveau chapitres : full hierarchy for a level (replaces apiact.py)
# =============================================================================

def _build_activite(act, type_name):
    a = {
        "Type_Act": type_name,
        "Act_Name": act.Name_Act,
    }
    if type_name == "quizz":
        img = db.session.get(Img, act.No_dImg) if act.No_dImg else None
        a["N_Img"] = img.N_Img if img else ""

        listes_rows = Liste.query.filter_by(Act_liste=act.No_Act).order_by(
            Liste.Num_Liste_Act, Liste.No_Liste
        ).all()

        lists_map = {}
        etiquettes_list = []
        for lst in listes_rows:
            key = lst.Num_Liste_Act
            if key not in lists_map:
                lists_map[key] = {"Num_Liste": key, "Reponses": []}
            rep = db.session.get(Reponse, lst.Num_Rep)
            rep_text = rep.Reponse if rep else "?"
            lists_map[key]["Reponses"].append(rep_text)

            rep_idx = len(lists_map[key]["Reponses"]) - 1
            etiqs = Etiquette.query.filter_by(No_liste=lst.No_Liste).order_by(Etiquette.No_Etiqu).all()
            for eq in etiqs:
                etiquettes_list.append({
                    "Rep_good": rep_idx,
                    "X": eq.x,
                    "Y": eq.y,
                    "Liste_Num": lst.Num_Liste_Act,
                })

        a["Listes"] = [lists_map[k] for k in sorted(lists_map.keys())]
        a["Etiquettes"] = etiquettes_list
    else:
        lien = Lien.query.filter_by(No_dAct=act.No_Act).first()
        a["Lnk_Act"] = lien.Link if lien else ""

    return a


@activites_bp.route("/niveau/<int:niv_id>", methods=["GET"])
def get_niveau_chapitres(niv_id):
    niv = db.session.get(Niveau, niv_id)
    if not niv:
        return jsonify({"error": "Niveau not found"}), 404

    type_quizz = TypeActivite.query.filter_by(Name_Type="quizz").first()
    quizz_id = type_quizz.No_Type if type_quizz else 1

    attr_nivs = AttribNiv.query.filter_by(No_dNiv=niv_id).order_by(AttribNiv.No_dChap).all()

    chap_activites = []
    for an in attr_nivs:
        attr_chaps = AttribChap.query.filter_by(No_dChap=an.No_dChap).order_by(AttribChap.No_Attrib).all()
        for ac in attr_chaps:
            act_attr = ActAttrib.query.filter_by(
                No_Niv_Attrib=niv_id, No_Act_Attrib=ac.No_dAct
            ).first()
            if act_attr:
                chap_activites.append((an.No_dChap, ac.No_dAct))

    if not chap_activites:
        return jsonify([])

    chapitres = []
    current_chap_id = chap_activites[0][0]
    chap = db.session.get(Chap, current_chap_id)
    current_entry = {"Chap_Name": chap.Name_Chap if chap else "?"}
    activites_list = []

    for chap_id, act_id in chap_activites:
        if chap_id != current_chap_id:
            activites_list.sort(key=lambda a: a["Act_Name"])
            current_entry["Activites"] = activites_list
            chapitres.append(current_entry)
            current_chap_id = chap_id
            chap = db.session.get(Chap, chap_id)
            current_entry = {"Chap_Name": chap.Name_Chap if chap else "?"}
            activites_list = []

        act = db.session.get(Activite, act_id)
        if act:
            type_name = "quizz" if act.Type_Act == quizz_id else "lien"
            activites_list.append(_build_activite(act, type_name))

    activites_list.sort(key=lambda a: a["Act_Name"])
    current_entry["Activites"] = activites_list
    chapitres.append(current_entry)

    return jsonify(chapitres)
