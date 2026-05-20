from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ProjetBase(BaseModel):
    nom: str = Field(..., min_length=1, max_length=100)
    classe_id: int


class ProjetCreate(ProjetBase):
    pass


class ProjetUpdate(BaseModel):
    nom: str | None = Field(default=None, min_length=1, max_length=100)
    classe_id: int | None = None


class ProjetOut(ProjetBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime | None = None
