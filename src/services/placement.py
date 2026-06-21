"""Service de placement des élèves dans les groupes."""

from ..models import Eleve, EleveGroupe, Groupe, Projet


class PlacementService:
    def __init__(self, session):
        self.session = session

    def get_or_create_projet(self, classe_id):
        projet = Projet.query.filter_by(classe_id=classe_id).first()
        if not projet:
            projet = Projet(nom="Projet par défaut", classe_id=classe_id)
            self.session.add(projet)
            self.session.flush()
        return projet

    def get_or_create_groupe(self, nom, projet_id):
        groupe = Groupe.query.filter_by(nom=nom, projet_id=projet_id).first()
        if not groupe:
            groupe = Groupe(nom=nom, projet_id=projet_id)
            self.session.add(groupe)
            self.session.flush()
        return groupe

    def assign_eleve(self, eleve_id, groupe_nom, projet_id=None):
        eleve = self.session.get(Eleve, int(eleve_id))
        if not eleve:
            return {"success": False, "error": "Élève introuvable"}

        if projet_id:
            projet_id = int(projet_id)
        else:
            projet = self.get_or_create_projet(eleve.classe_id)
            projet_id = projet.id

        groupe = self.get_or_create_groupe(groupe_nom, projet_id)

        other_groupes = self.session.query(Groupe.id).filter(
            Groupe.projet_id == projet_id,
            Groupe.id != groupe.id,
        )
        EleveGroupe.query.filter(
            EleveGroupe.eleve_id == eleve.id,
            EleveGroupe.groupe_id.in_(other_groupes),
        ).delete(synchronize_session=False)

        existing = EleveGroupe.query.filter_by(eleve_id=eleve.id, groupe_id=groupe.id).first()
        if not existing:
            self.session.add(EleveGroupe(eleve_id=eleve.id, groupe_id=groupe.id))
        self.session.commit()
        return {"success": True, "groupe_id": groupe.id}

    def unassign_eleve(self, eleve_id, projet_id=None):
        eleve = self.session.get(Eleve, int(eleve_id))
        if not eleve:
            return {"success": False, "error": "Élève introuvable"}

        if projet_id:
            subquery = self.session.query(Groupe.id).filter(Groupe.projet_id == int(projet_id))
            EleveGroupe.query.filter(
                EleveGroupe.eleve_id == eleve.id,
                EleveGroupe.groupe_id.in_(subquery),
            ).delete(synchronize_session=False)
        else:
            EleveGroupe.query.filter_by(eleve_id=eleve.id).delete(synchronize_session=False)

        self.session.commit()
        return {"success": True}

    def get_unassigned_eleves(self, classe_id):
        assigned_ids = (
            self.session.query(EleveGroupe.eleve_id)
            .join(Groupe, EleveGroupe.groupe_id == Groupe.id)
            .join(Projet, Groupe.projet_id == Projet.id)
            .filter(Projet.classe_id == classe_id)
        )
        assigned_scalar = assigned_ids.scalar_subquery()
        return Eleve.query.filter(
            Eleve.classe_id == classe_id,
            Eleve.id.notin_(assigned_scalar),
        ).all()

    def get_groupes_with_counts(self, classe_id):
        projet = Projet.query.filter_by(classe_id=classe_id).first()
        if not projet:
            return []
        groupes = Groupe.query.filter_by(projet_id=projet.id).order_by(Groupe.nom).all()
        result = []
        for g in groupes:
            count = EleveGroupe.query.filter_by(groupe_id=g.id).count()
            result.append({"groupe": g.to_dict(), "nb_eleves": count})
        return result
