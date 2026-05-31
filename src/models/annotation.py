from datetime import datetime, timezone

from ..database import db


class Annotation(db.Model):
    __tablename__ = "annotations"

    id = db.Column(db.Integer, primary_key=True)
    eleve_id = db.Column(db.Integer, db.ForeignKey("eleves.id"), nullable=True)
    groupe_id = db.Column(db.Integer, db.ForeignKey("groupes.id"), nullable=True)
    texte = db.Column(db.Text, nullable=False)
    date_saisie = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    eleve = db.relationship("Eleve", backref="annotations")
    groupe = db.relationship("Groupe", backref="annotations")

    @property
    def groupe_nom(self):
        return self.groupe.nom if self.groupe else None

    def to_dict(self):
        return {
            "id": self.id,
            "eleve_id": self.eleve_id,
            "groupe_id": self.groupe_id,
            "texte": self.texte,
            "date_saisie": self.date_saisie.isoformat() if self.date_saisie else None,
        }
