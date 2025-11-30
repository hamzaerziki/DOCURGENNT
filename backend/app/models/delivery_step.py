"""Delivery step tracking model"""
from sqlalchemy import Column, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database.database import Base


class DeliveryStep(Base):
    """Delivery step tracking for document requests"""
    __tablename__ = "delivery_steps"
    
    id = Column(String(36), primary_key=True)
    document_request_id = Column(String(36), ForeignKey('document_requests.id'), nullable=False)
    
    # Step information
    step_id = Column(String(50), nullable=False)  # collect_envelope, take_plane, landed, handled_envelope
    step_name = Column(String(100), nullable=False)
    
    # Status
    completed = Column(Boolean, default=False)
    
    # Completion tracking
    completed_at = Column(DateTime, nullable=True)
    completed_by = Column(String(36), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    document_request = relationship("DocumentRequest", back_populates="delivery_steps")
