"""Teacher model"""
from sqlalchemy import Column, String, Integer, Date, ForeignKey, JSON
from sqlalchemy.orm import relationship

from app.database.base import BaseModel


class Teacher(BaseModel):
    """Teacher model"""
    __tablename__ = "teachers"
    
    # Link to User
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, unique=True)
    
    # Teacher Information
    employee_id = Column(String(50), unique=True, nullable=False, index=True)
    date_of_birth = Column(Date)
    gender = Column(String(20))
    
    # Professional Information
    qualification = Column(String(255))
    specialization = Column(String(255))
    experience_years = Column(Integer, default=0)
    joining_date = Column(Date, nullable=False)
    
    # Subjects taught (stored as JSON array)
    subjects = Column(JSON, default=[])
    
    # Employment
    employment_type = Column(String(50))  # full-time, part-time, contract
    salary = Column(Integer)
    
    # Contact
    emergency_contact_name = Column(String(255))
    emergency_contact_phone = Column(String(50))
    
    # Address
    address = Column(String(500))
    city = Column(String(100))
    state = Column(String(100))
    postal_code = Column(String(20))
    
    # Relationships
    tenant = relationship("Tenant", back_populates="teachers")
    user = relationship("User", foreign_keys=[user_id])
    timetables = relationship("Timetable", back_populates="teacher", cascade="all, delete-orphan")
