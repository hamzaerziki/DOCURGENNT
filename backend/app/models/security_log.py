"""Security logging model"""
from sqlalchemy import Column, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database.database import Base


class SecurityLog(Base):
    """Security audit log model"""
    __tablename__ = "security_logs"
    
    id = Column(String(36), primary_key=True)
    
    # Event information
    action = Column(String(100), nullable=False, index=True)
    details = Column(Text)
    
    # Related entities
    user_id = Column(String(36), ForeignKey('users.id'), nullable=True)
    document_request_id = Column(String(36), ForeignKey('document_requests.id'), nullable=True)
    
    # Request metadata
    ip_address = Column(String(50))
    user_agent = Column(String(500))
    
    # Timestamp
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    
    # Relationships
    user = relationship("User", back_populates="security_logs")
    document_request = relationship("DocumentRequest", back_populates="security_logs")
