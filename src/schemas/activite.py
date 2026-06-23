from pydantic import BaseModel, ConfigDict, Field


# --- Activite ---
class ActiviteCreate(BaseModel):
    Name_Act: str = Field(..., min_length=1, max_length=48)
    Type_Act: int = Field(default=1)
    No_dImg: int = Field(default=0)


class ActiviteUpdate(BaseModel):
    Name_Act: str | None = Field(default=None, min_length=1, max_length=48)
    Type_Act: int | None = None
    No_dImg: int | None = None


class ActiviteOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    No_Act: int
    Type_Act: int | None = None
    Name_Act: str
    No_dImg: int | None = None
    img_name: str | None = None
    lien_url: str | None = None
    chapitre_names: list[str] | None = None
    niveau_names: list[str] | None = None


# --- Img ---
class ImgCreate(BaseModel):
    N_Img: str = Field(..., min_length=1, max_length=256)


class ImgUpdate(BaseModel):
    N_Img: str | None = Field(default=None, min_length=1, max_length=256)


class ImgOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    No_Img: int
    N_Img: str


# --- Lien ---
class LienCreate(BaseModel):
    Link: str = Field(..., min_length=1, max_length=256)


class LienUpdate(BaseModel):
    Link: str | None = Field(default=None, min_length=1, max_length=256)


class LienOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    No_Lien: int
    No_dAct: int | None = None
    Link: str


# --- Chap ---
class ChapCreate(BaseModel):
    Name_Chap: str = Field(..., min_length=1)


class ChapUpdate(BaseModel):
    Name_Chap: str | None = Field(default=None, min_length=1)


class ChapOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    No_chap: int
    Name_Chap: str


# --- Niveau ---
class NiveauCreate(BaseModel):
    Name_Niv: str = Field(..., min_length=1)
    qcm_active: int | None = Field(default=1)
    qcm_bg: str | None = Field(default=None)
    qcm_theme: str | None = Field(default=None)


class NiveauUpdate(BaseModel):
    Name_Niv: str | None = Field(default=None, min_length=1)
    qcm_active: int | None = Field(default=None)
    qcm_bg: str | None = Field(default=None)
    qcm_theme: str | None = Field(default=None)


class NiveauOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    No_Niv: int
    Name_Niv: str
    qcm_active: int | None = 1
    qcm_bg: str | None = None
    qcm_theme: str | None = None


# --- Reponse ---
class ReponseCreate(BaseModel):
    Reponse: str = Field(..., min_length=1, max_length=32)


class ReponseUpdate(BaseModel):
    Reponse: str | None = Field(default=None, min_length=1, max_length=32)


class ReponseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    No_Rep: int
    Reponse: str


# --- Type ---
class TypeActiviteOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    No_Type: int
    Name_Type: str


# --- Join table schemas ---
class AttribChapOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    No_Attrib: int
    No_dChap: int
    No_dAct: int


class AttribNivOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    No_Niv_Attrib: int
    No_dChap: int
    No_dNiv: int


class ActAttribOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    pk: int
    No_Niv_Attrib: int
    No_Act_Attrib: int
