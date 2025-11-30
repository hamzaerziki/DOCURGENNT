"""Notification model"""
from sqlalchemy import Column, String, Integer, ForeignKey, Boolean, Enum as SQLEnum, Text, JSON
from sqlalchemy.orm import relationship
import enum
from datetime import datetime

from app.database.base import BaseModel


class NotificationType(str, enum.Enum):
    """Notification type enumeration"""
    INFO = "info"
    WARNING = "warning"
    ALERT = "alert"
    SUCCESS = "success"
    ANNOUNCEMENT = "announcement"


class NotificationChannel(str, enum.Enum):
    """Notification delivery channel"""
    IN_APP = "in_app"
    EMAIL = "email"
    SMS = "sms"
    PUSH = "push"


class Notification(BaseModel):
    """Notification model"""
    __tablename__ = "notifications"
    
    # Recipient
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    
    # Content
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(SQLEnum(NotificationType), default=NotificationType.INFO)
    
    # Delivery
    channels = Column(JSON, default=["in_app"])  # List of channels to send through
    
    # Status
    is_read = Column(Boolean, default=False)
    read_at = Column(String(255), nullable=True)
    
    # Metadata
    metadata = Column(JSON, default={})  # Additional data like links, actions
    
    # Priority
    priority = Column(Integer, default=0)  # Higher number = higher priority
    
    # Expiry
    expires_at = Column(String(255), nullable=True)
    
    # Relationships
    tenant = relationship("Tenant")
    user = relationship("User")
