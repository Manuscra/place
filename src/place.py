"""Placement des élèves par glisser-déposer dans des groupes."""

from flask import Blueprint, jsonify, request

from .database import db
from .services import PlacementService

place_bp = Blueprint("place", __name__)


def _get_service():
    return PlacementService(db.session)


@place_bp.route("/api/assign", methods=["POST"])
def api_assign():
    data = request.get_json() or {}
    eleve_id = data.get("eleve_id")
    groupe_nom = data.get("groupe")
    projet_id = data.get("projet_id")

    if not eleve_id or not groupe_nom:
        return jsonify({"success": False, "error": "eleve_id et groupe requis"}), 400

    result = _get_service().assign_eleve(eleve_id, groupe_nom, projet_id)
    if result.get("success"):
        return jsonify(result)
    return jsonify(result), 400


@place_bp.route("/api/unassign", methods=["POST"])
def api_unassign():
    data = request.get_json() or {}
    eleve_id = data.get("eleve_id")
    projet_id = data.get("projet_id")

    if not eleve_id:
        return jsonify({"success": False, "error": "eleve_id requis"}), 400

    result = _get_service().unassign_eleve(eleve_id, projet_id)
    return jsonify(result)
