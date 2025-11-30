"""Tenant schemas"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any
from datetime import datetime


class TenantBase(BaseModel):
    """Base tenant schema"""
    name: str = Field(..., min_length=1, max_length=255)
    domain: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None


class TenantCreate(TenantBase):
    """Tenant creation schema"""
    subscription_plan: str = "basic"


class TenantUpdate(BaseModel):
    """Tenant update schema"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None


class TenantResponse(TenantBase):
    """Tenant response schema"""
    id: int
    subscription_plan: str
    subscription_status: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
