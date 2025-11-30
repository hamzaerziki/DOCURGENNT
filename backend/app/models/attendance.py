"""Attendance model"""
from sqlalchemy import Column, String, Integer, ForeignKey, Date, Enum as SQLEnum, Time
from sqlalchemy.orm import relationship
import enum

from app.database.base import BaseModel


class AttendanceStatus(str, enum.Enum):
    """Attendance status enumeration"""
    PRESENT = "present"
    ABSENT = "absent"
    LATE = "late"
    EXCUSED = "excused"
    HALF_DAY = "half_day"


class Attendance(BaseModel):
    """Attendance model"""
    __tablename__ = "attendances"
    
    # Student and Class
    student_id = Column(Integer, ForeignKey('students.id'), nullable=False)
    class_id = Column(Integer, ForeignKey('classes.id'), nullable=False)
    
    # Date and Time
    date = Column(Date, nullable=False, index=True)
    check_in_time = Column(Time)
    check_out_time = Column(Time)
    
    # Status
    status = Column(SQLEnum(AttendanceStatus), nullable=False, default=AttendanceStatus.PRESENT)
    
    # Remarks
    remarks = Column(String(500))
    
    # Marked by
    marked_by_id = Column(Integer, ForeignKey('users.id'))
    
    # Relationships
    tenant = relationship("Tenant")
    student = relationship("Student", back_populates="attendances")
    class_obj = relationship("Class", back_populates="attendances")
    marked_by = relationship("User", foreign_keys=[marked_by_id])
