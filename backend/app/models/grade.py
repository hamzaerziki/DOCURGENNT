"""Grade model"""
from sqlalchemy import Column, String, Integer, Float, ForeignKey, Date, Text
from sqlalchemy.orm import relationship

from app.database.base import BaseModel


class Grade(BaseModel):
    """Grade/Mark model"""
    __tablename__ = "grades"
    
    # Student and Subject
    student_id = Column(Integer, ForeignKey('students.id'), nullable=False)
    subject_id = Column(Integer, ForeignKey('subjects.id'), nullable=False)
    
    # Grade Information
    exam_type = Column(String(100), nullable=False)  # midterm, final, quiz, assignment
    exam_name = Column(String(255))
    exam_date = Column(Date)
    
    # Scores
    marks_obtained = Column(Float, nullable=False)
    total_marks = Column(Float, nullable=False)
    grade = Column(String(10))  # A+, A, B+, etc.
    
    # Grading Period
    academic_year = Column(String(20), nullable=False)
    semester = Column(String(50))
    
    # Comments
    remarks = Column(Text)
    
    # Relationships
    tenant = relationship("Tenant")
    student = relationship("Student", back_populates="grades")
    subject = relationship("Subject")
    
    @property
    def percentage(self) -> float:
        """Calculate percentage"""
        if self.total_marks > 0:
            return (self.marks_obtained / self.total_marks) * 100
        return 0.0
