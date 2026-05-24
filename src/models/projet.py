from datetime import datetime, timezone

from ..database import db


class Projet(db.Model):
    __tablename__ = "projets"

    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    classe_id = db.Column(db.Integer, db.ForeignKey("classes.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    classe = db.relationship("Classe", back_populates="projets")
    groupes = db.relationship("Groupe", back_populates="projet", lazy="selectin", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "nom": self.nom,
            "classe_id": self.classe_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
