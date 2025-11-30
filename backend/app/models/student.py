"""Student model"""
from sqlalchemy import Column, String, Integer, Date, ForeignKey, Table
from sqlalchemy.orm import relationship

from app.database.base import BaseModel


# Association table for student-parent relationship
student_parent = Table(
    'student_parent',
    BaseModel.metadata,
    Column('student_id', Integer, ForeignKey('students.id'), primary_key=True),
    Column('parent_id', Integer, ForeignKey('users.id'), primary_key=True)
)


class Student(BaseModel):
    """Student model"""
    __tablename__ = "students"
    
    # Link to User
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, unique=True)
    
    # Student Information
    student_id = Column(String(50), unique=True, nullable=False, index=True)
    date_of_birth = Column(Date, nullable=False)
    gender = Column(String(20))
    blood_group = Column(String(10))
    
    # Academic Information
    grade_level = Column(String(50), nullable=False)
    section = Column(String(50))
    roll_number = Column(String(50))
    admission_date = Column(Date, nullable=False)
    admission_number = Column(String(50), unique=True)
    
    # Emergency Contact
    emergency_contact_name = Column(String(255))
    emergency_contact_phone = Column(String(50))
    emergency_contact_relation = Column(String(50))
    
    # Medical Information
    medical_conditions = Column(String(1000))
    allergies = Column(String(1000))
    
    # Address
    address = Column(String(500))
    city = Column(String(100))
    state = Column(String(100))
    postal_code = Column(String(20))
    
    # Relationships
    tenant = relationship("Tenant", back_populates="students")
    user = relationship("User", foreign_keys=[user_id])
    parents = relationship("User", secondary=student_parent, backref="children")
    grades = relationship("Grade", back_populates="student", cascade="all, delete-orphan")
    attendances = relationship("Attendance", back_populates="student", cascade="all, delete-orphan")
    payments = relationship("Payment", back_populates="student", cascade="all, delete-orphan")
