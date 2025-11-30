"""Authentication schemas for DocUrgent platform"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from enum import Enum


class UserTypeEnum(str, Enum):
    """User type enumeration"""
    SENDER = "sender"
    TRAVELER = "traveler"
    RELAY_POINT = "relay_point"
    RECIPIENT = "recipient"
    ADMIN = "admin"


class UserRegister(BaseModel):
    """User registration schema for DocUrgent"""
    phone: str = Field(..., min_length=10, max_length=20, description="Phone number (required, primary identifier)")
    password: str = Field(..., min_length=8, description="Password (minimum 8 characters)")
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    email: Optional[EmailStr] = Field(None, description="Email (optional)")
    user_type: UserTypeEnum = Field(..., description="User type: sender, traveler, relay_point, recipient, or admin")
    
    class Config:
        json_schema_extra = {
            "example": {
                "phone": "+33612345678",
                "password": "securepassword123",
                "first_name": "Jean",
                "last_name": "Dupont",
                "email": "jean.dupont@example.com",
                "user_type": "sender"
            }
        }


class UserLogin(BaseModel):
    """User login schema - can use phone or email"""
    identifier: str = Field(..., description="Phone number or email")
    password: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "identifier": "+33612345678",  # or "user@example.com"
                "password": "securepassword123"
            }
        }


class Token(BaseModel):
    """Token response schema"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenRefresh(BaseModel):
    """Token refresh request schema"""
    refresh_token: str


class ForgotPassword(BaseModel):
    """Forgot password request schema"""
    identifier: str = Field(..., description="Phone number or email")


class ResetPassword(BaseModel):
    """Reset password schema"""
    token: str
    new_password: str = Field(..., min_length=8)


class ChangePassword(BaseModel):
    """Change password schema"""
    current_password: str
    new_password: str = Field(..., min_length=8)

