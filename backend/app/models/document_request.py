"""Document request model for delivery workflow"""
from sqlalchemy import Column, String, ForeignKey, Enum as SQLEnum, DateTime, Text
from sqlalchemy.orm import relationship
import enum
from datetime import datetime

from app.database.database import Base


class RequestStatus(str, enum.Enum):
    """Document request status"""
    CREATED = "created"
    AT_RELAY_POINT = "at_relay_point"
    WITH_TRAVELER = "with_traveler"
    DELIVERED = "delivered"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class DocumentType(str, enum.Enum):
    """Document types"""
    PASSPORT_COPY = "passport_copy"
    BIRTH_CERTIFICATE = "birth_certificate"
    MARRIAGE_CERTIFICATE = "marriage_certificate"
    DIPLOMA = "diploma"
    OFFICIAL_DOCUMENT = "official_document"
    OTHER = "other"


class DocumentRequest(Base):
    """Document delivery request model"""
    __tablename__ = "document_requests"
    
    id = Column(String(36), primary_key=True)
    
    # Sender information
    sender_id = Column(String(36), ForeignKey('users.id'), nullable=False)
    sender_name = Column(String(255), nullable=False)
    sender_phone = Column(String(50), nullable=False)
    source_address = Column(String(500), nullable=False)
    
    # Recipient information
    recipient_name = Column(String(255), nullable=False)
    recipient_phone = Column(String(50), nullable=False)
    destination_address = Column(String(500), nullable=False)
    
    # Document information
    document_type = Column(SQLEnum(DocumentType), nullable=False)
    document_description = Column(Text)
    
    # Traveler (assigned when accepted)
    traveler_id = Column(String(36), ForeignKey('users.id'), nullable=True)
    trip_id = Column(String(36), ForeignKey('trips.id'), nullable=True)
    
    # Relay point (auto-assigned based on location)
    relay_point_id = Column(String(36), ForeignKey('relay_points.id'), nullable=True)
    
    # Verification codes (all 8-character alphanumeric)
    unique_code = Column(String(20), unique=True, nullable=False, index=True)  # Sender → Relay (DOCXXXXX)
    delivery_code = Column(String(20), nullable=False)  # Receiver → Traveler (RCVXXXXX)
    traveler_code = Column(String(20), nullable=False)  # Traveler → Relay (TRVXXXXX)
    
    # QR codes
    qr_code_url = Column(String(500), nullable=True)
    
    # Status
    status = Column(SQLEnum(RequestStatus), nullable=False, default=RequestStatus.CREATED)
    
    # Pricing
    offered_price = Column(String(10), default="0")  # Store as string to avoid float issues
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    completed_at = Column(DateTime, nullable=True)
    completed_by = Column(String(36), nullable=True)
    
    # Relationships
    sender = relationship("User", foreign_keys=[sender_id], back_populates="sent_requests")
    traveler = relationship("User", foreign_keys=[traveler_id])
    trip = relationship("Trip", back_populates="document_requests")
    relay_point = relationship("RelayPoint", back_populates="document_requests")
    delivery_steps = relationship("DeliveryStep", back_populates="document_request", cascade="all, delete-orphan")
    security_logs = relationship("SecurityLog", back_populates="document_request", cascade="all, delete-orphan")
