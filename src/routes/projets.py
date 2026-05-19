from flask import Blueprint, jsonify, request

from ..database import db
from ..models import Projet
from ..schemas import ProjetCreate, ProjetOut, ProjetUpdate

projets_bp = Blueprint("projets", __name__, url_prefix="/api/projets")


@projets_bp.route("", methods=["GET"])
def list_projets():
    classe_id = request.args.get("classe_id", type=int)
    query = Projet.query.order_by(Projet.nom)
    if classe_id is not None:
        query = query.filter_by(classe_id=classe_id)
    projets = query.all()
    return jsonify([ProjetOut.model_validate(p).model_dump(mode="json") for p in projets])


@projets_bp.route("/<int:projet_id>", methods=["GET"])
def get_projet(projet_id):
    projet = db.session.get(Projet, projet_id)
    if not projet:
        return jsonify({"error": "Projet not found"}), 404
    return jsonify(ProjetOut.model_validate(projet).model_dump(mode="json"))


@projets_bp.route("", methods=["POST"])
def create_projet():
    data = ProjetCreate.model_validate(request.get_json(silent=True) or {})
    projet = Projet(**data.model_dump())
    db.session.add(projet)
    db.session.commit()
    return jsonify(ProjetOut.model_validate(projet).model_dump(mode="json")), 201


@projets_bp.route("/<int:projet_id>", methods=["PUT"])
def update_projet(projet_id):
    projet = db.session.get(Projet, projet_id)
    if not projet:
        return jsonify({"error": "Projet not found"}), 404
    data = ProjetUpdate.model_validate(request.get_json(silent=True) or {})
    for key, val in data.model_dump(exclude_unset=True).items():
        setattr(projet, key, val)
    db.session.commit()
    return jsonify(ProjetOut.model_validate(projet).model_dump(mode="json"))


@projets_bp.route("/<int:projet_id>", methods=["DELETE"])
def delete_projet(projet_id):
    projet = db.session.get(Projet, projet_id)
    if not projet:
        return jsonify({"error": "Projet not found"}), 404
    db.session.delete(projet)
    db.session.commit()
    return jsonify({"message": "Projet deleted"}), 200
