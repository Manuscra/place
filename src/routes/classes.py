from flask import Blueprint, jsonify, request

from ..database import db
from ..models import Classe
from ..schemas import ClasseCreate, ClasseOut, ClasseUpdate

classes_bp = Blueprint("classes", __name__, url_prefix="/api/classes")


@classes_bp.route("", methods=["GET"])
def list_classes():
    classes = Classe.query.order_by(Classe.nom).all()
    return jsonify([ClasseOut.model_validate(c).model_dump(mode="json") for c in classes])


@classes_bp.route("/<int:classe_id>", methods=["GET"])
def get_classe(classe_id):
    classe = db.session.get(Classe, classe_id)
    if not classe:
        return jsonify({"error": "Classe not found"}), 404
    return jsonify(ClasseOut.model_validate(classe).model_dump(mode="json"))


@classes_bp.route("", methods=["POST"])
def create_classe():
    data = ClasseCreate.model_validate(request.get_json(silent=True) or {})
    classe = Classe(**data.model_dump())
    db.session.add(classe)
    db.session.commit()
    return jsonify(ClasseOut.model_validate(classe).model_dump(mode="json")), 201


@classes_bp.route("/<int:classe_id>", methods=["PUT"])
def update_classe(classe_id):
    classe = db.session.get(Classe, classe_id)
    if not classe:
        return jsonify({"error": "Classe not found"}), 404
    data = ClasseUpdate.model_validate(request.get_json(silent=True) or {})
    for key, val in data.model_dump(exclude_unset=True).items():
        setattr(classe, key, val)
    db.session.commit()
    return jsonify(ClasseOut.model_validate(classe).model_dump(mode="json"))


@classes_bp.route("/<int:classe_id>", methods=["DELETE"])
def delete_classe(classe_id):
    classe = db.session.get(Classe, classe_id)
    if not classe:
        return jsonify({"error": "Classe not found"}), 404
    db.session.delete(classe)
    db.session.commit()
    return jsonify({"message": "Classe deleted"}), 200
