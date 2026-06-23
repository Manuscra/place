from ..database import db


class Activite(db.Model):
    __tablename__ = "Activite"

    No_Act = db.Column("No_Act", db.Integer, primary_key=True, autoincrement=True)
    Type_Act = db.Column("Type_Act", db.Integer, default=1)
    Name_Act = db.Column("Name_Act", db.String(48), nullable=False)
    No_dImg = db.Column("No_dImg", db.Integer, default=0)


class ActAttrib(db.Model):
    __tablename__ = "Act_Attrib"

    pk = db.Column("No-Act_Attrib", db.Integer, primary_key=True, autoincrement=True)
    No_Niv_Attrib = db.Column("No_Niv_Attrib", db.Integer, nullable=False)
    No_Act_Attrib = db.Column("No_Act_Attrib", db.Integer, nullable=False)


class AttribChap(db.Model):
    __tablename__ = "Attrib_Chap"

    No_Attrib = db.Column("No_Attrib", db.Integer, primary_key=True, autoincrement=True)
    No_dChap = db.Column("No_dChap", db.Integer, nullable=False)
    No_dAct = db.Column("No_dAct", db.Integer, nullable=False)


class AttribNiv(db.Model):
    __tablename__ = "Attrib_Niv"

    No_Niv_Attrib = db.Column("No_Niv_Attrib", db.Integer, primary_key=True, autoincrement=True)
    No_dChap = db.Column("No_dChap", db.Integer, nullable=False)
    No_dNiv = db.Column("No_dNiv", db.Integer, nullable=False)


class Chap(db.Model):
    __tablename__ = "Chap"

    No_chap = db.Column("No_chap", db.Integer, primary_key=True, autoincrement=True)
    Name_Chap = db.Column("Name_Chap", db.Text, nullable=False)


class Etiquette(db.Model):
    __tablename__ = "Etiquettes"

    No_Etiqu = db.Column("No_Etiqu", db.Integer, primary_key=True, autoincrement=True)
    x = db.Column("x", db.Integer, nullable=False)
    y = db.Column("y", db.Integer, nullable=False)
    No_liste = db.Column("No_liste", db.Integer, nullable=False)


class Img(db.Model):
    __tablename__ = "Img"

    No_Img = db.Column("No_Img", db.Integer, primary_key=True, autoincrement=True)
    N_Img = db.Column("N_Img", db.String(256), nullable=False)


class Lien(db.Model):
    __tablename__ = "Liens"

    No_Lien = db.Column("No_Lien", db.Integer, primary_key=True, autoincrement=True)
    No_dAct = db.Column("No_dAct", db.Integer, default=0)
    Link = db.Column("Link", db.String(256), nullable=False)


class Liste(db.Model):
    __tablename__ = "Listes"

    No_Liste = db.Column("No_Liste", db.Integer, primary_key=True, autoincrement=True)
    Act_liste = db.Column("Act_liste", db.Integer, nullable=False)
    Num_Liste_Base = db.Column("Num_Liste_Base", db.Integer, nullable=False)
    Num_Liste_Act = db.Column("Num_Liste_Act", db.Integer, nullable=False)
    Num_Rep = db.Column("Num_Rep", db.Integer, nullable=False)


class Niveau(db.Model):
    __tablename__ = "Niveau"

    No_Niv = db.Column("No_Niv", db.Integer, primary_key=True, autoincrement=True)
    Name_Niv = db.Column("Name_Niv", db.Text, nullable=False)
    qcm_active = db.Column("qcm_active", db.Integer, nullable=False, default=1)
    qcm_bg = db.Column("qcm_bg", db.Text, nullable=True)
    qcm_theme = db.Column("qcm_theme", db.Text, nullable=True)


class Reponse(db.Model):
    __tablename__ = "Reponses"

    No_Rep = db.Column("No_Rep", db.Integer, primary_key=True, autoincrement=True)
    Reponse = db.Column("Reponse", db.String(32), nullable=False)


class TypeActivite(db.Model):
    __tablename__ = "Type"

    No_Type = db.Column("No_Type", db.Integer, primary_key=True, autoincrement=True)
    Name_Type = db.Column("Name_Type", db.String(6), nullable=False)
