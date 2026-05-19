from flask import Blueprint, jsonify, request

from ..database import db
from ..models import Member, Team
from ..schemas import (
    MemberCreate,
    MemberOut,
    MemberUpdate,
    TeamCreate,
    TeamOut,
    TeamUpdate,
)

api = Blueprint("api", __name__, url_prefix="/api")


# --- Teams ---

@api.route("/teams", methods=["GET"])
def list_teams():
    teams = Team.query.order_by(Team.name).all()
    return jsonify([TeamOut.model_validate(t).model_dump(mode="json") for t in teams])


@api.route("/teams/<int:team_id>", methods=["GET"])
def get_team(team_id):
    team = db.session.get(Team, team_id)
    if not team:
        return jsonify({"error": "Team not found"}), 404
    return jsonify(TeamOut.model_validate(team).model_dump(mode="json"))


@api.route("/teams", methods=["POST"])
def create_team():
    data = TeamCreate.model_validate(request.get_json(silent=True) or {})
    team = Team(**data.model_dump())
    db.session.add(team)
    db.session.commit()
    return jsonify(TeamOut.model_validate(team).model_dump(mode="json")), 201


@api.route("/teams/<int:team_id>", methods=["PUT"])
def update_team(team_id):
    team = db.session.get(Team, team_id)
    if not team:
        return jsonify({"error": "Team not found"}), 404
    data = TeamUpdate.model_validate(request.get_json(silent=True) or {})
    for key, val in data.model_dump(exclude_unset=True).items():
        setattr(team, key, val)
    db.session.commit()
    return jsonify(TeamOut.model_validate(team).model_dump(mode="json"))


@api.route("/teams/<int:team_id>", methods=["DELETE"])
def delete_team(team_id):
    team = db.session.get(Team, team_id)
    if not team:
        return jsonify({"error": "Team not found"}), 404
    db.session.delete(team)
    db.session.commit()
    return jsonify({"message": "Team deleted"}), 200


# --- Members ---

@api.route("/members", methods=["GET"])
def list_members():
    team_id = request.args.get("team_id", type=int)
    query = Member.query.order_by(Member.name)
    if team_id is not None:
        query = query.filter_by(team_id=team_id)
    members = query.all()
    return jsonify([MemberOut.model_validate(m).model_dump(mode="json") for m in members])


@api.route("/members/<int:member_id>", methods=["GET"])
def get_member(member_id):
    member = db.session.get(Member, member_id)
    if not member:
        return jsonify({"error": "Member not found"}), 404
    return jsonify(MemberOut.model_validate(member).model_dump(mode="json"))


@api.route("/members", methods=["POST"])
def create_member():
    data = MemberCreate.model_validate(request.get_json(silent=True) or {})
    member = Member(**data.model_dump())
    db.session.add(member)
    db.session.commit()
    return jsonify(MemberOut.model_validate(member).model_dump(mode="json")), 201


@api.route("/members/<int:member_id>", methods=["PUT"])
def update_member(member_id):
    member = db.session.get(Member, member_id)
    if not member:
        return jsonify({"error": "Member not found"}), 404
    data = MemberUpdate.model_validate(request.get_json(silent=True) or {})
    for key, val in data.model_dump(exclude_unset=True).items():
        setattr(member, key, val)
    db.session.commit()
    return jsonify(MemberOut.model_validate(member).model_dump(mode="json"))


@api.route("/members/<int:member_id>", methods=["DELETE"])
def delete_member(member_id):
    member = db.session.get(Member, member_id)
    if not member:
        return jsonify({"error": "Member not found"}), 404
    db.session.delete(member)
    db.session.commit()
    return jsonify({"message": "Member deleted"}), 200
