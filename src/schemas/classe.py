from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ClasseBase(BaseModel):
    nom: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(default=None, max_length=500)


class ClasseCreate(ClasseBase):
    pass


class ClasseUpdate(BaseModel):
    nom: Optional[str] = Field(default=None, min_length=1, max_length=100)
    description: Optional[str] = Field(default=None, max_length=500)


class ClasseOut(ClasseBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        orm_mode = True
