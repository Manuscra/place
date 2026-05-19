from datetime import datetime, timezone

from ..database import db


class Eleve(db.Model):
    __tablename__ = "eleves"

    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    prenom = db.Column(db.String(100), nullable=False)
    classe_id = db.Column(db.Integer, db.ForeignKey("classes.id"), nullable=False)
    groupe_id = db.Column(db.Integer, db.ForeignKey("groupes.id"), nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    classe = db.relationship("Classe", backref="eleves")
    groupe = db.relationship("Groupe", back_populates="eleves")

    def to_dict(self):
        return {
            "id": self.id,
            "nom": self.nom,
            "prenom": self.prenom,
            "classe_id": self.classe_id,
            "groupe_id": self.groupe_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
