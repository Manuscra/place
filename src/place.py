"""Placement des élèves par glisser-déposer dans des groupes."""

from flask import Blueprint, jsonify, render_template, request

from .database import db
from .models import Classe, Eleve, Groupe, Projet

place_bp = Blueprint("place", __name__, url_prefix="/place")


@place_bp.route("/")
def index():
    return render_template("place.html")


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

    if not eleve_id or not groupe_nom:
        return jsonify({"success": False, "error": "eleve_id et groupe requis"}), 400

    eleve = db.session.get(Eleve, int(eleve_id))
    if not eleve:
        return jsonify({"success": False, "error": "Élève introuvable"}), 400

    projet = _get_or_create_projet(eleve.classe_id)
    groupe = _get_or_create_groupe(groupe_nom, projet.id)

    eleve.groupe_id = groupe.id
    db.session.commit()
    return jsonify({"success": True, "groupe_id": groupe.id})


@place_bp.route("/api/unassign", methods=["POST"])
def api_unassign():
    data = request.get_json() or {}
    eleve_id = data.get("eleve_id")

    if not eleve_id:
        return jsonify({"success": False, "error": "eleve_id requis"}), 400

    eleve = db.session.get(Eleve, int(eleve_id))
    if not eleve:
        return jsonify({"success": False, "error": "Élève introuvable"}), 400

    eleve.groupe_id = None
    db.session.commit()
    return jsonify({"success": True})


@place_bp.route("/api/classes", methods=["GET"])
def api_get_classes():
    classes = Classe.query.order_by(Classe.nom).all()
    return jsonify([{"id": c.id, "nom": c.nom} for c in classes])
