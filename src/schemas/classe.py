from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ClasseBase(BaseModel):
    nom: str = Field(..., min_length=1, max_length=100)
    description: str | None = Field(default=None, max_length=500)


class ClasseCreate(ClasseBase):
    pass


class ClasseUpdate(BaseModel):
    nom: str | None = Field(default=None, min_length=1, max_length=100)
    description: str | None = Field(default=None, max_length=500)


class ClasseOut(ClasseBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime | None = None
