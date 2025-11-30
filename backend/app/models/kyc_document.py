"""KYC document verification model"""
from sqlalchemy import Column, String, Boolean, ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.orm import relationship
import enum
from datetime import datetime

from app.database.database import Base


class DocumentTypeKYC(str, enum.Enum):
    """KYC document types"""
    NATIONAL_ID = "national_id"
    PASSPORT = "passport"
    DRIVERS_LICENSE = "drivers_license"


class KYCDocument(Base):
    """KYC document verification model"""
    __tablename__ = "kyc_documents"
    
    id = Column(String(36), primary_key=True)
    user_id = Column(String(36), ForeignKey('users.id'), nullable=False)
    
    # Document type
    document_type = Column(SQLEnum(DocumentTypeKYC), nullable=False)
    document_number = Column(String(100))
    
    # File uploads
    front_image_url = Column(String(500))
    back_image_url = Column(String(500))
    selfie_url = Column(String(500))
    
    # Verification
    is_verified = Column(Boolean, default=False)
    verified_at = Column(DateTime, nullable=True)
    verified_by = Column(String(36), nullable=True)
    rejection_reason = Column(String(500), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="kyc_documents")
