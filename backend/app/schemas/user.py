"""User schemas for DocUrgent platform"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    """Base user schema"""
    phone: str
    email: Optional[EmailStr] = None
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    user_type: str  # sender, traveler, relay_point, recipient, admin


class UserCreate(UserBase):
    """User creation schema"""
    password: str = Field(..., min_length=8)


class UserUpdate(BaseModel):
    """User update schema"""
    first_name: Optional[str] = Field(None, min_length=1, max_length=100)
    last_name: Optional[str] = Field(None, min_length=1, max_length=100)
    email: Optional[EmailStr] = None
    residence_city: Optional[str] = None
    address: Optional[str] = None
    country: Optional[str] = None
    is_active: Optional[bool] = None


class UserResponse(UserBase):
    """User response schema"""
    id: str  # UUID
    user_type: str
    is_phone_verified: bool
    is_email_verified: bool
    verification_status: str  # unverified, pending, verified, rejected
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserProfile(UserResponse):
    """Extended user profile schema"""
    residence_city: Optional[str] = None
    address: Optional[str] = None
    country: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    last_login: Optional[datetime] = None
    
    class Config:
        from_attributes = True

