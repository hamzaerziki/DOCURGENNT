"""Relay point model"""
from sqlalchemy import Column, String, Boolean, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database.database import Base


class RelayPoint(Base):
    """Relay point model for document handoff locations"""
    __tablename__ = "relay_points"
    
    id = Column(String(36), primary_key=True)
    user_id = Column(String(36), ForeignKey('users.id'), nullable=False, unique=True)
    
    # Location information
    location_name = Column(String(255), nullable=False)
    address = Column(String(500), nullable=False)
    city = Column(String(100), nullable=False)
    country = Column(String(100), nullable=False)
    postal_code = Column(String(20))
    
    # Geolocation
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    
    # Contact
    phone = Column(String(50))
    email = Column(String(255))
    
    # Operating hours
    operating_hours = Column(String(500))  # JSON string or text
    
    # Verification
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="relay_point")
    document_requests = relationship("DocumentRequest", back_populates="relay_point")
