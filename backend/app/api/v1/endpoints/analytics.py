"""Analytics endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict, Any, List
from datetime import datetime, timedelta

from app.core.dependencies import get_db, get_current_user, require_admin
from app.models.user import User
from app.models.student import Student
from app.models.grade import Grade
from app.models.attendance import Attendance, AttendanceStatus
from app.models.payment import Payment, Invoice


router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/student-progress/{student_id}")
def get_student_progress(
    student_id: int,
    academic_year: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get student academic progress and performance metrics"""
    student = db.query(Student).filter(
        Student.id == student_id,
        Student.tenant_id == current_user.tenant_id
    ).first()
    
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    # Get grades
    grades_query = db.query(Grade).filter(Grade.student_id == student_id)
    if academic_year:
        grades_query = grades_query.filter(Grade.academic_year == academic_year)
    
    grades = grades_query.all()
    
    # Calculate average
    if grades:
        total_percentage = sum(g.percentage for g in grades)
        average = total_percentage / len(grades)
    else:
        average = 0
    
    # Get attendance stats
    total_days = db.query(Attendance).filter(
        Attendance.student_id == student_id
    ).count()
    
    present_days = db.query(Attendance).filter(
        Attendance.student_id == student_id,
        Attendance.status == AttendanceStatus.PRESENT
    ).count()
    
    attendance_rate = (present_days / total_days * 100) if total_days > 0 else 0
    
    # Get payment status
    total_invoices = db.query(func.sum(Invoice.total_amount)).filter(
        Invoice.student_id == student_id
    ).scalar() or 0
    
    total_paid = db.query(func.sum(Invoice.paid_amount)).filter(
        Invoice.student_id == student_id
    ).scalar() or 0
    
    return {
        "student_id": student_id,
        "student_name": student.user.full_name if student.user else "N/A",
        "grade_level": student.grade_level,
        "academic_performance": {
            "average_percentage": round(average, 2),
            "total_exams": len(grades),
            "grades_by_subject": [
                {
                    "subject": g.subject.name if g.subject else "N/A",
                    "percentage": round(g.percentage, 2),
                    "grade": g.grade
                }
                for g in grades
            ]
        },
        "attendance": {
            "total_days": total_days,
            "present_days": present_days,
            "attendance_rate": round(attendance_rate, 2)
        },
        "financial": {
            "total_invoiced": total_invoices,
            "total_paid": total_paid,
            "balance": total_invoices - total_paid
        }
    }


@router.get("/school-performance")
def get_school_performance(
    academic_year: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get overall school performance metrics"""
    # Total students
    total_students = db.query(Student).filter(
        Student.tenant_id == current_user.tenant_id
    ).count()
    
    # Total teachers
    total_teachers = db.query(User).filter(
        User.tenant_id == current_user.tenant_id,
        User.role == "teacher"
    ).count()
    
    # Average attendance (last 30 days)
    thirty_days_ago = datetime.now().date() - timedelta(days=30)
    recent_attendance = db.query(Attendance).filter(
        Attendance.tenant_id == current_user.tenant_id,
        Attendance.date >= thirty_days_ago
    ).all()
    
    if recent_attendance:
        present_count = sum(1 for a in recent_attendance if a.status == AttendanceStatus.PRESENT)
        avg_attendance = (present_count / len(recent_attendance)) * 100
    else:
        avg_attendance = 0
    
    # Financial overview
    total_revenue = db.query(func.sum(Payment.amount)).filter(
        Payment.tenant_id == current_user.tenant_id
    ).scalar() or 0
    
    pending_payments = db.query(func.sum(Invoice.total_amount - Invoice.paid_amount)).filter(
        Invoice.tenant_id == current_user.tenant_id,
        Invoice.total_amount > Invoice.paid_amount
    ).scalar() or 0
    
    return {
        "overview": {
            "total_students": total_students,
            "total_teachers": total_teachers,
            "average_attendance_rate": round(avg_attendance, 2)
        },
        "financial": {
            "total_revenue": total_revenue,
            "pending_payments": pending_payments
        },
        "period": "Last 30 days"
    }


@router.get("/teacher-activity/{teacher_id}")
def get_teacher_activity(
    teacher_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get teacher activity and performance metrics"""
    teacher = db.query(User).filter(
        User.id == teacher_id,
        User.tenant_id == current_user.tenant_id,
        User.role == "teacher"
    ).first()
    
    if not teacher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Teacher not found"
        )
    
    # This is a placeholder - extend based on actual requirements
    return {
        "teacher_id": teacher_id,
        "teacher_name": teacher.full_name,
        "activity": {
            "classes_assigned": 0,  # TODO: Implement
            "students_taught": 0,   # TODO: Implement
            "attendance_marked": 0  # TODO: Implement
        }
    }


@router.get("/ai-recommendations")
def get_ai_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get AI-powered recommendations for school improvement"""
    # This is a placeholder for AI recommendations
    # In production, this would integrate with ML models
    
    recommendations = [
        {
            "category": "Academic",
            "priority": "high",
            "recommendation": "Focus on improving math scores in Grade 5",
            "action_items": [
                "Provide additional tutoring sessions",
                "Review curriculum effectiveness",
                "Identify struggling students early"
            ]
        },
        {
            "category": "Attendance",
            "priority": "medium",
            "recommendation": "Attendance rate below 90% in some classes",
            "action_items": [
                "Contact parents of frequently absent students",
                "Review attendance policies",
                "Implement attendance rewards program"
            ]
        },
        {
            "category": "Financial",
            "priority": "high",
            "recommendation": "High pending payments detected",
            "action_items": [
                "Send payment reminders",
                "Offer payment plans",
                "Review fee structure"
            ]
        }
    ]
    
    return {
        "recommendations": recommendations,
        "generated_at": datetime.utcnow().isoformat()
    }
