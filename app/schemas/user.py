from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from app.models.user import UserRole


class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr


class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=100)
    role: Optional[UserRole] = Field(default=UserRole.DEVELOPER)


class UserLogin(BaseModel):
    username: str
    password: str


class UserSummary(BaseModel):
    id: int
    username: str
    role: UserRole

    class Config:
        from_attributes = True


class UserResponse(UserBase):
    id: int
    role: UserRole
    created_at: datetime

    class Config:
        from_attributes = True