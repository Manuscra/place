from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ProjetBase(BaseModel):
    nom: str = Field(..., min_length=1, max_length=100)
    classe_id: int


class ProjetCreate(ProjetBase):
    pass


class ProjetUpdate(BaseModel):
    nom: Optional[str] = Field(default=None, min_length=1, max_length=100)
    classe_id: Optional[int] = None


class ProjetOut(ProjetBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        orm_mode = True
