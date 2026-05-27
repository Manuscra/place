from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class EleveBase(BaseModel):
    nom: str = Field(..., min_length=1, max_length=100)
    prenom: str = Field(..., min_length=1, max_length=100)
    classe_id: int
    present: bool = True
    annotation: str | None = None


class EleveCreate(EleveBase):
    pass


class EleveUpdate(BaseModel):
    nom: str | None = Field(default=None, min_length=1, max_length=100)
    prenom: str | None = Field(default=None, min_length=1, max_length=100)
    classe_id: int | None = None
    present: bool | None = None
    annotation: str | None = None


class EleveOut(EleveBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    classe_nom: str | None = None
    created_at: datetime | None = None
