"""Assignment model"""
from sqlalchemy import Column, String, Integer, ForeignKey, Date, Text, Boolean, JSON
from sqlalchemy.orm import relationship

from app.database.base import BaseModel


class Assignment(BaseModel):
    """Assignment/Homework model"""
    __tablename__ = "assignments"
    
    # Class and Subject
    class_id = Column(Integer, ForeignKey('classes.id'), nullable=False)
    subject_id = Column(Integer, ForeignKey('subjects.id'), nullable=False)
    teacher_id = Column(Integer, ForeignKey('teachers.id'), nullable=False)
    
    # Assignment Details
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    instructions = Column(Text)
    
    # Dates
    assigned_date = Column(Date, nullable=False)
    due_date = Column(Date, nullable=False)
    
    # Points
    total_points = Column(Integer, default=100)
    
    # Attachments (stored as JSON array of file URLs)
    attachments = Column(JSON, default=[])
    
    # Status
    is_published = Column(Boolean, default=True)
    
    # Relationships
    tenant = relationship("Tenant")
    class_obj = relationship("Class")
    subject = relationship("Subject")
    teacher = relationship("Teacher")
