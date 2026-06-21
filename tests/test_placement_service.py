from src.database import db
from src.models import Classe, Eleve, EleveGroupe, Groupe, Projet
from src.services import PlacementService


class TestPlacementService:
    def test_get_or_create_projet_creates_when_missing(self, app):
        with app.app_context():
            classe = Classe(nom="6ème A")
            db.session.add(classe)
            db.session.commit()

            svc = PlacementService(db.session)
            projet = svc.get_or_create_projet(classe.id)

            assert projet.id is not None
            assert projet.nom == "Projet par défaut"
            assert projet.classe_id == classe.id

    def test_get_or_create_projet_returns_existing(self, app):
        with app.app_context():
            classe = Classe(nom="6ème A")
            db.session.add(classe)
            db.session.commit()

            svc = PlacementService(db.session)
            first = svc.get_or_create_projet(classe.id)
            second = svc.get_or_create_projet(classe.id)

            assert first.id == second.id
            assert Projet.query.filter_by(classe_id=classe.id).count() == 1

    def test_get_or_create_groupe_creates_new(self, app):
        with app.app_context():
            classe = Classe(nom="6ème A")
            db.session.add(classe)
            db.session.commit()
            projet = Projet(nom="Projet Test", classe_id=classe.id)
            db.session.add(projet)
            db.session.commit()

            svc = PlacementService(db.session)
            groupe = svc.get_or_create_groupe("Groupe A", projet.id)

            assert groupe.id is not None
            assert groupe.nom == "Groupe A"
            assert groupe.projet_id == projet.id

    def test_get_or_create_groupe_returns_existing(self, app):
        with app.app_context():
            classe = Classe(nom="6ème A")
            db.session.add(classe)
            db.session.commit()
            projet = Projet(nom="Projet Test", classe_id=classe.id)
            db.session.add(projet)
            db.session.commit()

            svc = PlacementService(db.session)
            first = svc.get_or_create_groupe("Groupe A", projet.id)
            second = svc.get_or_create_groupe("Groupe A", projet.id)

            assert first.id == second.id
            assert Groupe.query.filter_by(nom="Groupe A", projet_id=projet.id).count() == 1

    def test_assign_eleve_creates_groupe_and_projet(self, app):
        with app.app_context():
            classe = Classe(nom="6ème A")
            db.session.add(classe)
            db.session.commit()
            eleve = Eleve(nom="Dupont", prenom="Jean", classe_id=classe.id)
            db.session.add(eleve)
            db.session.commit()

            svc = PlacementService(db.session)
            result = svc.assign_eleve(eleve.id, "Groupe A")

            assert result["success"] is True
            assert result["groupe_id"] is not None
            assert Projet.query.filter_by(classe_id=classe.id).count() == 1
            assert Groupe.query.filter_by(nom="Groupe A").count() == 1
            assert EleveGroupe.query.filter_by(eleve_id=eleve.id).count() == 1

    def test_assign_eleve_moves_from_other_groupe(self, app):
        with app.app_context():
            classe = Classe(nom="6ème A")
            db.session.add(classe)
            db.session.commit()
            projet = Projet(nom="Projet Test", classe_id=classe.id)
            db.session.add(projet)
            db.session.commit()
            groupe_a = Groupe(nom="Groupe A", projet_id=projet.id)
            groupe_b = Groupe(nom="Groupe B", projet_id=projet.id)
            db.session.add_all([groupe_a, groupe_b])
            db.session.commit()
            eleve = Eleve(nom="Dupont", prenom="Jean", classe_id=classe.id)
            db.session.add(eleve)
            db.session.commit()
            db.session.add(EleveGroupe(eleve_id=eleve.id, groupe_id=groupe_a.id))
            db.session.commit()

            svc = PlacementService(db.session)
            result = svc.assign_eleve(eleve.id, "Groupe B", projet_id=projet.id)

            assert result["success"] is True
            assert EleveGroupe.query.filter_by(eleve_id=eleve.id, groupe_id=groupe_a.id).count() == 0
            assert EleveGroupe.query.filter_by(eleve_id=eleve.id, groupe_id=groupe_b.id).count() == 1

    def test_assign_eleve_invalid_eleve(self, app):
        with app.app_context():
            svc = PlacementService(db.session)
            result = svc.assign_eleve(999, "Groupe A")

            assert result["success"] is False
            assert "introuvable" in result["error"]

    def test_unassign_eleve_removes_from_groupe(self, app):
        with app.app_context():
            classe = Classe(nom="6ème A")
            db.session.add(classe)
            db.session.commit()
            projet = Projet(nom="Projet Test", classe_id=classe.id)
            db.session.add(projet)
            db.session.commit()
            groupe = Groupe(nom="Groupe A", projet_id=projet.id)
            db.session.add(groupe)
            db.session.commit()
            eleve = Eleve(nom="Dupont", prenom="Jean", classe_id=classe.id)
            db.session.add(eleve)
            db.session.commit()
            db.session.add(EleveGroupe(eleve_id=eleve.id, groupe_id=groupe.id))
            db.session.commit()

            svc = PlacementService(db.session)
            result = svc.unassign_eleve(eleve.id, projet_id=projet.id)

            assert result["success"] is True
            assert EleveGroupe.query.filter_by(eleve_id=eleve.id).count() == 0

    def test_unassign_eleve_without_projet_removes_all(self, app):
        with app.app_context():
            classe = Classe(nom="6ème A")
            db.session.add(classe)
            db.session.commit()
            projet = Projet(nom="Projet Test", classe_id=classe.id)
            db.session.add(projet)
            db.session.commit()
            groupe = Groupe(nom="Groupe A", projet_id=projet.id)
            db.session.add(groupe)
            db.session.commit()
            eleve = Eleve(nom="Dupont", prenom="Jean", classe_id=classe.id)
            db.session.add(eleve)
            db.session.commit()
            db.session.add(EleveGroupe(eleve_id=eleve.id, groupe_id=groupe.id))
            db.session.commit()

            svc = PlacementService(db.session)
            result = svc.unassign_eleve(eleve.id)

            assert result["success"] is True
            assert EleveGroupe.query.filter_by(eleve_id=eleve.id).count() == 0

    def test_get_unassigned_eleves(self, app):
        with app.app_context():
            classe = Classe(nom="6ème A")
            db.session.add(classe)
            db.session.commit()
            projet = Projet(nom="Projet Test", classe_id=classe.id)
            db.session.add(projet)
            db.session.commit()
            groupe = Groupe(nom="Groupe A", projet_id=projet.id)
            db.session.add(groupe)
            db.session.commit()
            eleve1 = Eleve(nom="Dupont", prenom="Jean", classe_id=classe.id)
            eleve2 = Eleve(nom="Martin", prenom="Luc", classe_id=classe.id)
            db.session.add_all([eleve1, eleve2])
            db.session.commit()
            db.session.add(EleveGroupe(eleve_id=eleve1.id, groupe_id=groupe.id))
            db.session.commit()

            svc = PlacementService(db.session)
            unassigned = svc.get_unassigned_eleves(classe.id)

            assert len(unassigned) == 1
            assert unassigned[0].id == eleve2.id

    def test_get_groupes_with_counts(self, app):
        with app.app_context():
            classe = Classe(nom="6ème A")
            db.session.add(classe)
            db.session.commit()
            projet = Projet(nom="Projet Test", classe_id=classe.id)
            db.session.add(projet)
            db.session.commit()
            groupe_a = Groupe(nom="Groupe A", projet_id=projet.id)
            groupe_b = Groupe(nom="Groupe B", projet_id=projet.id)
            db.session.add_all([groupe_a, groupe_b])
            db.session.commit()
            eleve1 = Eleve(nom="Dupont", prenom="Jean", classe_id=classe.id)
            eleve2 = Eleve(nom="Martin", prenom="Luc", classe_id=classe.id)
            db.session.add_all([eleve1, eleve2])
            db.session.commit()
            db.session.add(EleveGroupe(eleve_id=eleve1.id, groupe_id=groupe_a.id))
            db.session.add(EleveGroupe(eleve_id=eleve2.id, groupe_id=groupe_a.id))
            db.session.commit()

            svc = PlacementService(db.session)
            result = svc.get_groupes_with_counts(classe.id)

            assert len(result) == 2
            assert result[0]["nb_eleves"] == 2
            assert result[1]["nb_eleves"] == 0

    def test_get_groupes_with_counts_no_projet(self, app):
        with app.app_context():
            classe = Classe(nom="6ème A")
            db.session.add(classe)
            db.session.commit()

            svc = PlacementService(db.session)
            result = svc.get_groupes_with_counts(classe.id)

            assert result == []
