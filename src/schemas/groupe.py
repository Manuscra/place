from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class GroupeBase(BaseModel):
    nom: str = Field(..., min_length=1, max_length=100)
    projet_id: int


class GroupeCreate(GroupeBase):
    pass


class GroupeUpdate(BaseModel):
    nom: str | None = Field(default=None, min_length=1, max_length=100)
    projet_id: int | None = None


class GroupeOut(GroupeBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime | None = None
