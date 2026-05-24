from ..database import db


class EleveGroupe(db.Model):
    __tablename__ = "eleve_groupes"

    eleve_id = db.Column(db.Integer, db.ForeignKey("eleves.id", ondelete="CASCADE"), primary_key=True)
    groupe_id = db.Column(db.Integer, db.ForeignKey("groupes.id", ondelete="CASCADE"), primary_key=True)
