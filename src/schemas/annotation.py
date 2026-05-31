from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class AnnotationCreate(BaseModel):
    eleve_id: int | None = None
    groupe_id: int | None = None
    texte: str = Field(..., min_length=1)


class AnnotationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    eleve_id: int | None = None
    groupe_id: int | None = None
    groupe_nom: str | None = None
    texte: str
    date_saisie: datetime
