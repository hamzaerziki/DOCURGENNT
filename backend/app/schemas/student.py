"""Student schemas"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime


class StudentBase(BaseModel):
    """Base student schema"""
    student_id: str = Field(..., min_length=1, max_length=50)
    date_of_birth: date
    gender: Optional[str] = None
    grade_level: str = Field(..., min_length=1, max_length=50)
    section: Optional[str] = None
    admission_date: date


class StudentCreate(StudentBase):
    """Student creation schema"""
    user_id: int
    admission_number: str
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None


class StudentUpdate(BaseModel):
    """Student update schema"""
    grade_level: Optional[str] = None
    section: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    medical_conditions: Optional[str] = None
    allergies: Optional[str] = None
    address: Optional[str] = None


class StudentResponse(StudentBase):
    """Student response schema"""
    id: int
    user_id: int
    tenant_id: int
    admission_number: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class LinkParent(BaseModel):
    """Link parent to student schema"""
    parent_id: int
