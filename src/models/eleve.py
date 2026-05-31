from datetime import datetime, timezone

from ..database import db


class Eleve(db.Model):
    __tablename__ = "eleves"

    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    prenom = db.Column(db.String(100), nullable=False)
    classe_id = db.Column(db.Integer, db.ForeignKey("classes.id"), nullable=False)
    present = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    classe = db.relationship("Classe", backref="eleves")
    groupes = db.relationship("Groupe", secondary="eleve_groupes", back_populates="eleves", lazy="selectin")

    @property
    def classe_nom(self):
        return self.classe.nom if self.classe else None

    def to_dict(self):
        return {
            "id": self.id,
            "nom": self.nom,
            "prenom": self.prenom,
            "classe_id": self.classe_id,
            "classe_nom": self.classe_nom,
            "present": self.present,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
