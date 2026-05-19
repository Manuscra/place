from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class MemberBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    role: str = Field(default="member", min_length=1, max_length=50)
    team_id: int | None = None


class MemberCreate(MemberBase):
    pass


class MemberUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    email: EmailStr | None = None
    role: str | None = Field(default=None, min_length=1, max_length=50)
    team_id: int | None = None


class MemberOut(MemberBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime | None = None
