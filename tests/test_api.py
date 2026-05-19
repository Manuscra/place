import pytest

from src.app import create_app
from src.database import db
from src.models import Classe, Groupe, Projet


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
def sample_classe(app):
    with app.app_context():
        classe = Classe(nom="6ème A", description="Classe de sixième")
        db.session.add(classe)
        db.session.commit()
        return classe.id


@pytest.fixture
def sample_projet(app, sample_classe):
    with app.app_context():
        projet = Projet(nom="Projet Sciences", classe_id=sample_classe)
        db.session.add(projet)
        db.session.commit()
        return projet.id


@pytest.fixture
def sample_groupe(app, sample_projet):
    with app.app_context():
        groupe = Groupe(nom="Groupe 1", projet_id=sample_projet)
        db.session.add(groupe)
        db.session.commit()
        return groupe.id


class TestClasseAPI:
    def test_list_classes_empty(self, client):
        resp = client.get("/api/classes")
        assert resp.status_code == 200
        assert resp.get_json() == []

    def test_create_classe(self, client):
        resp = client.post(
            "/api/classes",
            json={"nom": "6ème B", "description": "Test"},
        )
        assert resp.status_code == 201
        data = resp.get_json()
        assert data["nom"] == "6ème B"
        assert data["id"] == 1

    def test_get_classe(self, client, sample_classe):
        resp = client.get(f"/api/classes/{sample_classe}")
        assert resp.status_code == 200
        assert resp.get_json()["nom"] == "6ème A"

    def test_update_classe(self, client, sample_classe):
        resp = client.put(f"/api/classes/{sample_classe}", json={"nom": "Modifiée"})
        assert resp.status_code == 200
        assert resp.get_json()["nom"] == "Modifiée"

    def test_delete_classe(self, client, sample_classe):
        resp = client.delete(f"/api/classes/{sample_classe}")
        assert resp.status_code == 200
        assert client.get("/api/classes").get_json() == []


class TestProjetAPI:
    def test_create_projet(self, client, sample_classe):
        resp = client.post(
            "/api/projets",
            json={"nom": "Projet Maths", "classe_id": sample_classe},
        )
        assert resp.status_code == 201
        data = resp.get_json()
        assert data["nom"] == "Projet Maths"
        assert data["classe_id"] == sample_classe

    def test_list_projets_by_classe(self, client, sample_projet, sample_classe):
        resp = client.get(f"/api/projets?classe_id={sample_classe}")
        assert resp.status_code == 200
        assert len(resp.get_json()) == 1
        assert resp.get_json()[0]["nom"] == "Projet Sciences"


class TestGroupeAPI:
    def test_create_groupe(self, client, sample_projet):
        resp = client.post(
            "/api/groupes",
            json={"nom": "Groupe A", "projet_id": sample_projet},
        )
        assert resp.status_code == 201
        data = resp.get_json()
        assert data["nom"] == "Groupe A"


class TestEleveAPI:
    def test_create_eleve(self, client, sample_classe, sample_groupe):
        resp = client.post(
            "/api/eleves",
            json={
                "nom": "Dupont",
                "prenom": "Alice",
                "classe_id": sample_classe,
                "groupe_id": sample_groupe,
            },
        )
        assert resp.status_code == 201
        data = resp.get_json()
        assert data["nom"] == "Dupont"
        assert data["prenom"] == "Alice"

    def test_create_eleve_validation(self, client):
        resp = client.post("/api/eleves", json={"nom": "", "prenom": "", "classe_id": 1})
        assert resp.status_code == 422

    def test_list_eleves_by_classe(self, client, sample_classe, sample_groupe):
        client.post(
            "/api/eleves",
            json={"nom": "Martin", "prenom": "Jean", "classe_id": sample_classe, "groupe_id": sample_groupe},
        )
        resp = client.get(f"/api/eleves?classe_id={sample_classe}")
        assert resp.status_code == 200
        assert len(resp.get_json()) == 1
