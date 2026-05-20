from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class EleveBase(BaseModel):
    nom: str = Field(..., min_length=1, max_length=100)
    prenom: str = Field(..., min_length=1, max_length=100)
    classe_id: int
    groupe_id: Optional[int] = None


class EleveCreate(EleveBase):
    pass


class EleveUpdate(BaseModel):
    nom: Optional[str] = Field(default=None, min_length=1, max_length=100)
    prenom: Optional[str] = Field(default=None, min_length=1, max_length=100)
    classe_id: Optional[int] = None
    groupe_id: Optional[int] = None


class EleveOut(EleveBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        orm_mode = True
