from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class GroupeBase(BaseModel):
    nom: str = Field(..., min_length=1, max_length=100)
    projet_id: int


class GroupeCreate(GroupeBase):
    pass


class GroupeUpdate(BaseModel):
    nom: Optional[str] = Field(default=None, min_length=1, max_length=100)
    projet_id: Optional[int] = None


class GroupeOut(GroupeBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        orm_mode = True
