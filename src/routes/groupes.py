from flask import Blueprint, jsonify, request

from ..database import db
from ..models import Groupe
from ..schemas import GroupeCreate, GroupeOut, GroupeUpdate

groupes_bp = Blueprint("groupes", __name__, url_prefix="/api/groupes")


@groupes_bp.route("", methods=["GET"])
def list_groupes():
    projet_id = request.args.get("projet_id", type=int)
    query = Groupe.query.order_by(Groupe.nom)
    if projet_id is not None:
        query = query.filter_by(projet_id=projet_id)
    groupes = query.all()
    return jsonify([GroupeOut.model_validate(g).model_dump(mode="json") for g in groupes])


@groupes_bp.route("/<int:groupe_id>", methods=["GET"])
def get_groupe(groupe_id):
    groupe = db.session.get(Groupe, groupe_id)
    if not groupe:
        return jsonify({"error": "Groupe not found"}), 404
    return jsonify(GroupeOut.model_validate(groupe).model_dump(mode="json"))


@groupes_bp.route("", methods=["POST"])
def create_groupe():
    data = GroupeCreate.model_validate(request.get_json(silent=True) or {})
    groupe = Groupe(**data.model_dump())
    db.session.add(groupe)
    db.session.commit()
    return jsonify(GroupeOut.model_validate(groupe).model_dump(mode="json")), 201


@groupes_bp.route("/<int:groupe_id>", methods=["PUT"])
def update_groupe(groupe_id):
    groupe = db.session.get(Groupe, groupe_id)
    if not groupe:
        return jsonify({"error": "Groupe not found"}), 404
    data = GroupeUpdate.model_validate(request.get_json(silent=True) or {})
    for key, val in data.model_dump(exclude_unset=True).items():
        setattr(groupe, key, val)
    db.session.commit()
    return jsonify(GroupeOut.model_validate(groupe).model_dump(mode="json"))


@groupes_bp.route("/<int:groupe_id>", methods=["DELETE"])
def delete_groupe(groupe_id):
    groupe = db.session.get(Groupe, groupe_id)
    if not groupe:
        return jsonify({"error": "Groupe not found"}), 404
    db.session.delete(groupe)
    db.session.commit()
    return jsonify({"message": "Groupe deleted"}), 200
