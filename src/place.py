"""Placement des élèves par glisser-déposer dans des groupes."""

from flask import Blueprint, jsonify, request

from .database import db
from .models import Eleve, EleveGroupe, Groupe, Projet

place_bp = Blueprint("place", __name__)


def _get_or_create_projet(classe_id):
    projet = Projet.query.filter_by(classe_id=classe_id).first()
    if not projet:
        projet = Projet(nom="Projet par défaut", classe_id=classe_id)
        db.session.add(projet)
        db.session.flush()
    return projet


def _get_or_create_groupe(nom, projet_id):
    groupe = Groupe.query.filter_by(nom=nom, projet_id=projet_id).first()
    if not groupe:
        groupe = Groupe(nom=nom, projet_id=projet_id)
        db.session.add(groupe)
        db.session.flush()
    return groupe


@place_bp.route("/api/assign", methods=["POST"])
def api_assign():
    data = request.get_json() or {}
    eleve_id = data.get("eleve_id")
    groupe_nom = data.get("groupe")
    projet_id = data.get("projet_id")

    if not eleve_id or not groupe_nom:
        return jsonify({"success": False, "error": "eleve_id et groupe requis"}), 400

    eleve = db.session.get(Eleve, int(eleve_id))
    if not eleve:
        return jsonify({"success": False, "error": "Élève introuvable"}), 400

    if projet_id:
        projet_id = int(projet_id)
    else:
        projet = _get_or_create_projet(eleve.classe_id)
        projet_id = projet.id

    groupe = _get_or_create_groupe(groupe_nom, projet_id)

    # Un élève ne peut être que dans un seul groupe par projet
    other_groupes = db.session.query(Groupe.id).filter(
        Groupe.projet_id == projet_id,
        Groupe.id != groupe.id,
    )
    EleveGroupe.query.filter(
        EleveGroupe.eleve_id == eleve.id,
        EleveGroupe.groupe_id.in_(other_groupes),
    ).delete(synchronize_session=False)

    existing = EleveGroupe.query.filter_by(eleve_id=eleve.id, groupe_id=groupe.id).first()
    if not existing:
        db.session.add(EleveGroupe(eleve_id=eleve.id, groupe_id=groupe.id))
    db.session.commit()
    return jsonify({"success": True, "groupe_id": groupe.id})


@place_bp.route("/api/unassign", methods=["POST"])
def api_unassign():
    data = request.get_json() or {}
    eleve_id = data.get("eleve_id")
    projet_id = data.get("projet_id")

    if not eleve_id:
        return jsonify({"success": False, "error": "eleve_id requis"}), 400

    eleve = db.session.get(Eleve, int(eleve_id))
    if not eleve:
        return jsonify({"success": False, "error": "Élève introuvable"}), 400

    if projet_id:
        subquery = db.session.query(Groupe.id).filter(Groupe.projet_id == int(projet_id))
        EleveGroupe.query.filter(
            EleveGroupe.eleve_id == eleve.id,
            EleveGroupe.groupe_id.in_(subquery),
        ).delete(synchronize_session=False)
    else:
        EleveGroupe.query.filter_by(eleve_id=eleve.id).delete(synchronize_session=False)

    db.session.commit()
    return jsonify({"success": True})
