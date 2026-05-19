from datetime import datetime, timezone

from ..database import db


class Classe(db.Model):
    __tablename__ = "classes"

    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    projets = db.relationship("Projet", back_populates="classe", lazy="selectin")

    def to_dict(self):
        return {
            "id": self.id,
            "nom": self.nom,
            "description": self.description,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
