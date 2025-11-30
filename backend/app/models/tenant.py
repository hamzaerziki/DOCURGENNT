"""Tenant (School) model"""
from sqlalchemy import Column, String, Boolean, JSON
from sqlalchemy.orm import relationship

from app.database.database import Base
from datetime import datetime
from sqlalchemy import Column, Integer, DateTime


class Tenant(Base):
    """Tenant/School model - root entity for multi-tenancy"""
    __tablename__ = "tenants"
    
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Basic Information
    name = Column(String(255), nullable=False, index=True)
    domain = Column(String(255), unique=True, nullable=False, index=True)
    email = Column(String(255), nullable=False)
    phone = Column(String(50))
    
    # Address
    address = Column(String(500))
    city = Column(String(100))
    state = Column(String(100))
    country = Column(String(100))
    postal_code = Column(String(20))
    
    # Settings
    settings = Column(JSON, default={})  # Store tenant-specific settings
    
    # Subscription
    subscription_plan = Column(String(50), default="basic")
    subscription_status = Column(String(50), default="active")
    subscription_expires_at = Column(DateTime, nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True)
    
    # Relationships
    users = relationship("User", back_populates="tenant", cascade="all, delete-orphan")
    students = relationship("Student", back_populates="tenant", cascade="all, delete-orphan")
    teachers = relationship("Teacher", back_populates="tenant", cascade="all, delete-orphan")
    classes = relationship("Class", back_populates="tenant", cascade="all, delete-orphan")
