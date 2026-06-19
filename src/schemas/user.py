"""Pydantic schemas for authentication."""

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserLogin(BaseModel):
    """Schema for user login."""

    username: str = Field(..., min_length=3, max_length=80)
    password: str = Field(..., min_length=6)


class UserRegister(BaseModel):
    """Schema for user registration."""

    username: str = Field(..., min_length=3, max_length=80)
    email: EmailStr
    password: str = Field(..., min_length=6)
    password_confirm: str = Field(..., min_length=6)


class UserOut(BaseModel):
    """Schema for user output."""

    id: int
    username: str
    email: str
    is_active: bool

    model_config = ConfigDict(from_attributes=True)
