from flask import Blueprint, jsonify, request

from ..database import db
from ..models import Projet
from ..schemas import ProjetCreate, ProjetOut, ProjetUpdate
from ..schemas import _serialize

projets_bp = Blueprint("projets", __name__, url_prefix="/api/projets")


@projets_bp.route("", methods=["GET"])
def list_projets():
    classe_id = request.args.get("classe_id", type=int)
    query = Projet.query.order_by(Projet.nom)
    if classe_id is not None:
        query = query.filter_by(classe_id=classe_id)
    projets = query.all()
    return jsonify([_serialize(ProjetOut.from_orm(p)) for p in projets])


@projets_bp.route("/<int:projet_id>", methods=["GET"])
def get_projet(projet_id):
    projet = db.session.get(Projet, projet_id)
    if not projet:
        return jsonify({"error": "Projet not found"}), 404
    return jsonify(_serialize(ProjetOut.from_orm(projet)))


@projets_bp.route("", methods=["POST"])
def create_projet():
    data = ProjetCreate.parse_obj(request.get_json(silent=True) or {})
    projet = Projet(**data.dict())
    db.session.add(projet)
    db.session.commit()
    return jsonify(_serialize(ProjetOut.from_orm(projet))), 201


@projets_bp.route("/<int:projet_id>", methods=["PUT"])
def update_projet(projet_id):
    projet = db.session.get(Projet, projet_id)
    if not projet:
        return jsonify({"error": "Projet not found"}), 404
    data = ProjetUpdate.parse_obj(request.get_json(silent=True) or {})
    for key, val in data.dict(exclude_unset=True).items():
        setattr(projet, key, val)
    db.session.commit()
    return jsonify(_serialize(ProjetOut.from_orm(projet)))


@projets_bp.route("/<int:projet_id>", methods=["DELETE"])
def delete_projet(projet_id):
    projet = db.session.get(Projet, projet_id)
    if not projet:
        return jsonify({"error": "Projet not found"}), 404
    db.session.delete(projet)
    db.session.commit()
    return jsonify({"message": "Projet deleted"}), 200
