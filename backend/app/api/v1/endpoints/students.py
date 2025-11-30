"""Student management endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.dependencies import get_db, get_current_user, require_admin
from app.models.user import User
from app.models.student import Student
from app.schemas.student import StudentCreate, StudentUpdate, StudentResponse, LinkParent
from app.schemas.common import MessageResponse


router = APIRouter(prefix="/students", tags=["Students"])


@router.get("", response_model=List[StudentResponse])
def list_students(
    skip: int = 0,
    limit: int = 20,
    grade_level: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List students in tenant"""
    query = db.query(Student).filter(Student.tenant_id == current_user.tenant_id)
    
    if grade_level:
        query = query.filter(Student.grade_level == grade_level)
    
    students = query.offset(skip).limit(limit).all()
    return students


@router.post("", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
def create_student(
    student_data: StudentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Create a new student"""
    # Check if student_id exists
    existing = db.query(Student).filter(
        Student.student_id == student_data.student_id,
        Student.tenant_id == current_user.tenant_id
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Student ID already exists"
        )
    
    student = Student(
        **student_data.model_dump(),
        tenant_id=current_user.tenant_id
    )
    
    db.add(student)
    db.commit()
    db.refresh(student)
    
    return student


@router.get("/{student_id}", response_model=StudentResponse)
def get_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get student by ID"""
    student = db.query(Student).filter(
        Student.id == student_id,
        Student.tenant_id == current_user.tenant_id
    ).first()
    
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    return student


@router.put("/{student_id}", response_model=StudentResponse)
def update_student(
    student_id: int,
    student_data: StudentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Update student"""
    student = db.query(Student).filter(
        Student.id == student_id,
        Student.tenant_id == current_user.tenant_id
    ).first()
    
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    update_data = student_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(student, field, value)
    
    db.commit()
    db.refresh(student)
    
    return student


@router.post("/{student_id}/link-parent", response_model=MessageResponse)
def link_parent_to_student(
    student_id: int,
    link_data: LinkParent,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Link a parent to a student"""
    student = db.query(Student).filter(
        Student.id == student_id,
        Student.tenant_id == current_user.tenant_id
    ).first()
    
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    parent = db.query(User).filter(
        User.id == link_data.parent_id,
        User.tenant_id == current_user.tenant_id,
        User.role == "parent"
    ).first()
    
    if not parent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Parent not found"
        )
    
    # Add parent to student's parents
    if parent not in student.parents:
        student.parents.append(parent)
        db.commit()
    
    return MessageResponse(message="Parent linked successfully")


@router.delete("/{student_id}", response_model=MessageResponse)
def delete_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Delete student"""
    student = db.query(Student).filter(
        Student.id == student_id,
        Student.tenant_id == current_user.tenant_id
    ).first()
    
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    db.delete(student)
    db.commit()
    
    return MessageResponse(message="Student deleted successfully")
