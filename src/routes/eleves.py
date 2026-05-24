from flask import Blueprint, jsonify, request

from ..database import db
from ..models import Eleve, EleveGroupe, Groupe
from ..schemas import EleveCreate, EleveOut, EleveUpdate

eleves_bp = Blueprint("eleves", __name__, url_prefix="/api/eleves")


@eleves_bp.route("", methods=["GET"])
def list_eleves():
    classe_id = request.args.get("classe_id", type=int)
    groupe_id = request.args.get("groupe_id", type=int)
    projet_id = request.args.get("projet_id", type=int)
    query = Eleve.query.order_by(Eleve.nom, Eleve.prenom)
    if classe_id is not None:
        query = query.filter_by(classe_id=classe_id)
    if groupe_id is not None:
        if groupe_id == 0:
            if projet_id is not None:
                subquery = (
                    db.session.query(EleveGroupe.eleve_id)
                    .join(Groupe, EleveGroupe.groupe_id == Groupe.id)
                    .filter(Groupe.projet_id == projet_id)
                )
            else:
                subquery = db.session.query(EleveGroupe.eleve_id)
            query = query.filter(Eleve.id.notin_(subquery))
        else:
            query = query.join(Eleve.groupes).filter(Groupe.id == groupe_id)
    eleves = query.all()
    return jsonify([EleveOut.model_validate(e).model_dump(mode="json") for e in eleves])


@eleves_bp.route("/<int:eleve_id>", methods=["GET"])
def get_eleve(eleve_id):
    eleve = db.session.get(Eleve, eleve_id)
    if not eleve:
        return jsonify({"error": "Eleve not found"}), 404
    return jsonify(EleveOut.model_validate(eleve).model_dump(mode="json"))


@eleves_bp.route("", methods=["POST"])
def create_eleve():
    data = EleveCreate.model_validate(request.get_json(silent=True) or {})
    eleve = Eleve(**data.model_dump())
    db.session.add(eleve)
    db.session.commit()
    return jsonify(EleveOut.model_validate(eleve).model_dump(mode="json")), 201


@eleves_bp.route("/<int:eleve_id>", methods=["PUT"])
def update_eleve(eleve_id):
    eleve = db.session.get(Eleve, eleve_id)
    if not eleve:
        return jsonify({"error": "Eleve not found"}), 404
    data = EleveUpdate.model_validate(request.get_json(silent=True) or {})
    for key, val in data.model_dump(exclude_unset=True).items():
        setattr(eleve, key, val)
    db.session.commit()
    return jsonify(EleveOut.model_validate(eleve).model_dump(mode="json"))


@eleves_bp.route("/<int:eleve_id>", methods=["DELETE"])
def delete_eleve(eleve_id):
    eleve = db.session.get(Eleve, eleve_id)
    if not eleve:
        return jsonify({"error": "Eleve not found"}), 404
    db.session.delete(eleve)
    db.session.commit()
    return jsonify({"message": "Eleve deleted"}), 200
