import pytest

from src.app import create_app
from src.database import db
from src.models import Team


@pytest.fixture
def app():
    app = create_app(testing=True)
    with app.app_context():
        db.create_all()
    yield app
    with app.app_context():
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def sample_team(app):
    with app.app_context():
        team = Team(name="Équipe A", description="Première équipe")
        db.session.add(team)
        db.session.commit()
        return team.id


class TestTeamAPI:
    def test_list_teams_empty(self, client):
        resp = client.get("/api/teams")
        assert resp.status_code == 200
        assert resp.get_json() == []

    def test_create_team(self, client):
        resp = client.post(
            "/api/teams",
            json={"name": "Équipe X", "description": "Test"},
        )
        assert resp.status_code == 201
        data = resp.get_json()
        assert data["name"] == "Équipe X"
        assert data["id"] == 1

    def test_get_team(self, client, sample_team):
        resp = client.get(f"/api/teams/{sample_team}")
        assert resp.status_code == 200
        assert resp.get_json()["name"] == "Équipe A"

    def test_update_team(self, client, sample_team):
        resp = client.put(f"/api/teams/{sample_team}", json={"name": "Updated"})
        assert resp.status_code == 200
        assert resp.get_json()["name"] == "Updated"

    def test_delete_team(self, client, sample_team):
        resp = client.delete(f"/api/teams/{sample_team}")
        assert resp.status_code == 200
        assert client.get("/api/teams").get_json() == []


class TestMemberAPI:
    def test_create_member(self, client, sample_team):
        resp = client.post(
            "/api/members",
            json={
                "name": "Alice",
                "email": "alice@example.com",
                "role": "developer",
                "team_id": sample_team,
            },
        )
        assert resp.status_code == 201
        data = resp.get_json()
        assert data["name"] == "Alice"
        assert data["email"] == "alice@example.com"

    def test_create_member_validation(self, client):
        resp = client.post("/api/members", json={"name": "", "email": "bad"})
        assert resp.status_code == 422
