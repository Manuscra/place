from flask import Blueprint, jsonify, request
from sqlalchemy.orm import joinedload

from ..database import db
from ..models import Annotation, EleveGroupe
from ..schemas import AnnotationCreate, AnnotationOut

annotations_bp = Blueprint("annotations", __name__, url_prefix="/api/annotations")


@annotations_bp.route("", methods=["GET"])
def list_annotations():
    eleve_id = request.args.get("eleve_id", type=int)
    groupe_id = request.args.get("groupe_id", type=int)
    query = Annotation.query.options(joinedload(Annotation.groupe)).order_by(Annotation.date_saisie.desc())
    if eleve_id is not None:
        groupe_ids_subq = db.session.query(EleveGroupe.groupe_id).filter(EleveGroupe.eleve_id == eleve_id)
        query = query.filter(
            (Annotation.eleve_id == eleve_id) | (Annotation.groupe_id.in_(groupe_ids_subq))
        )
    elif groupe_id is not None:
        query = query.filter_by(groupe_id=groupe_id)
    annotations = query.all()
    return jsonify([AnnotationOut.model_validate(a).model_dump(mode="json") for a in annotations])


@annotations_bp.route("", methods=["POST"])
def create_annotation():
    data = AnnotationCreate.model_validate(request.get_json(silent=True) or {})
    annotation = Annotation(**data.model_dump())
    db.session.add(annotation)
    db.session.commit()
    return jsonify(AnnotationOut.model_validate(annotation).model_dump(mode="json")), 201


@annotations_bp.route("/<int:annotation_id>", methods=["DELETE"])
def delete_annotation(annotation_id):
    annotation = db.session.get(Annotation, annotation_id)
    if not annotation:
        return jsonify({"error": "Annotation not found"}), 404
    db.session.delete(annotation)
    db.session.commit()
    return jsonify({"message": "Annotation deleted"}), 200
