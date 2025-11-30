"""Class, Course, and Subject models"""
from sqlalchemy import Column, String, Integer, ForeignKey, Table, Text
from sqlalchemy.orm import relationship

from app.database.base import BaseModel


# Association table for class-student relationship
class_student = Table(
    'class_student',
    BaseModel.metadata,
    Column('class_id', Integer, ForeignKey('classes.id'), primary_key=True),
    Column('student_id', Integer, ForeignKey('students.id'), primary_key=True)
)


class Subject(BaseModel):
    """Subject model"""
    __tablename__ = "subjects"
    
    name = Column(String(255), nullable=False)
    code = Column(String(50), nullable=False)
    description = Column(Text)
    credits = Column(Integer, default=1)
    
    # Relationships
    tenant = relationship("Tenant")


class Course(BaseModel):
    """Course model"""
    __tablename__ = "courses"
    
    name = Column(String(255), nullable=False)
    code = Column(String(50), nullable=False)
    description = Column(Text)
    subject_id = Column(Integer, ForeignKey('subjects.id'), nullable=False)
    
    # Relationships
    tenant = relationship("Tenant")
    subject = relationship("Subject")


class Class(BaseModel):
    """Class/Section model"""
    __tablename__ = "classes"
    
    name = Column(String(255), nullable=False)
    section = Column(String(50))
    grade_level = Column(String(50), nullable=False)
    academic_year = Column(String(20), nullable=False)
    
    # Class Teacher
    teacher_id = Column(Integer, ForeignKey('teachers.id'))
    
    # Capacity
    max_students = Column(Integer, default=40)
    
    # Room
    room_number = Column(String(50))
    
    # Relationships
    tenant = relationship("Tenant", back_populates="classes")
    teacher = relationship("Teacher")
    students = relationship("Student", secondary=class_student, backref="classes")
    timetables = relationship("Timetable", back_populates="class_obj", cascade="all, delete-orphan")
    attendances = relationship("Attendance", back_populates="class_obj", cascade="all, delete-orphan")
