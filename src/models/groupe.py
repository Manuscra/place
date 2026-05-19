from datetime import datetime, timezone

from ..database import db


class Groupe(db.Model):
    __tablename__ = "groupes"

    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    projet_id = db.Column(db.Integer, db.ForeignKey("projets.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    projet = db.relationship("Projet", back_populates="groupes")
    eleves = db.relationship("Eleve", back_populates="groupe", lazy="selectin")

    def to_dict(self):
        return {
            "id": self.id,
            "nom": self.nom,
            "projet_id": self.projet_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
