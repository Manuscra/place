from flask import Blueprint, jsonify, request

from ..database import db
from ..models import Classe
from ..schemas import ClasseCreate, ClasseOut, ClasseUpdate
from ..schemas import _serialize

classes_bp = Blueprint("classes", __name__, url_prefix="/api/classes")


@classes_bp.route("", methods=["GET"])
def list_classes():
    classes = Classe.query.order_by(Classe.nom).all()
    return jsonify([_serialize(ClasseOut.from_orm(c)) for c in classes])


@classes_bp.route("/<int:classe_id>", methods=["GET"])
def get_classe(classe_id):
    classe = db.session.get(Classe, classe_id)
    if not classe:
        return jsonify({"error": "Classe not found"}), 404
    return jsonify(_serialize(ClasseOut.from_orm(classe)))


@classes_bp.route("", methods=["POST"])
def create_classe():
    data = ClasseCreate.parse_obj(request.get_json(silent=True) or {})
    classe = Classe(**data.dict())
    db.session.add(classe)
    db.session.commit()
    return jsonify(_serialize(ClasseOut.from_orm(classe))), 201


@classes_bp.route("/<int:classe_id>", methods=["PUT"])
def update_classe(classe_id):
    classe = db.session.get(Classe, classe_id)
    if not classe:
        return jsonify({"error": "Classe not found"}), 404
    data = ClasseUpdate.parse_obj(request.get_json(silent=True) or {})
    for key, val in data.dict(exclude_unset=True).items():
        setattr(classe, key, val)
    db.session.commit()
    return jsonify(_serialize(ClasseOut.from_orm(classe)))


@classes_bp.route("/<int:classe_id>", methods=["DELETE"])
def delete_classe(classe_id):
    classe = db.session.get(Classe, classe_id)
    if not classe:
        return jsonify({"error": "Classe not found"}), 404
    db.session.delete(classe)
    db.session.commit()
    return jsonify({"message": "Classe deleted"}), 200
