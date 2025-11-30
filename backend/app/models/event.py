"""Event and Timetable models"""
from sqlalchemy import Column, String, Integer, ForeignKey, Date, Time, Text, Boolean
from sqlalchemy.orm import relationship

from app.database.base import BaseModel


class Event(BaseModel):
    """Event/Calendar model"""
    __tablename__ = "events"
    
    # Event Details
    title = Column(String(255), nullable=False)
    description = Column(Text)
    event_type = Column(String(100))  # holiday, exam, meeting, sports, etc.
    
    # Date and Time
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    start_time = Column(Time)
    end_time = Column(Time)
    
    # Location
    location = Column(String(255))
    
    # Visibility
    is_public = Column(Boolean, default=True)
    
    # Organizer
    organized_by_id = Column(Integer, ForeignKey('users.id'))
    
    # Relationships
    tenant = relationship("Tenant")
    organizer = relationship("User", foreign_keys=[organized_by_id])


class Timetable(BaseModel):
    """Timetable/Schedule model"""
    __tablename__ = "timetables"
    
    # Class and Subject
    class_id = Column(Integer, ForeignKey('classes.id'), nullable=False)
    subject_id = Column(Integer, ForeignKey('subjects.id'), nullable=False)
    teacher_id = Column(Integer, ForeignKey('teachers.id'), nullable=False)
    
    # Schedule
    day_of_week = Column(Integer, nullable=False)  # 0=Monday, 6=Sunday
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    
    # Room
    room_number = Column(String(50))
    
    # Academic Period
    academic_year = Column(String(20), nullable=False)
    semester = Column(String(50))
    
    # Relationships
    tenant = relationship("Tenant")
    class_obj = relationship("Class", back_populates="timetables")
    subject = relationship("Subject")
    teacher = relationship("Teacher", back_populates="timetables")
