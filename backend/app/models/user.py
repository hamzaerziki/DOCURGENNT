"""User model with role-based access for document delivery platform"""
from sqlalchemy import Column, String, Boolean, Enum as SQLEnum, DateTime
from sqlalchemy.orm import relationship
import enum
from datetime import datetime

from app.database.database import Base


class UserRole(str, enum.Enum):
    """User roles enumeration"""
    SENDER = "sender"
    TRAVELER = "traveler"
    RELAY_POINT = "relay_point"
    RECIPIENT = "recipient"
    ADMIN = "admin"


class VerificationStatus(str, enum.Enum):
    """KYC verification status"""
    UNVERIFIED = "unverified"
    PENDING = "pending"
    VERIFIED = "verified"
    REJECTED = "rejected"


class User(Base):
    """User model for authentication and authorization"""
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True)
    
    # Authentication
    email = Column(String(255), unique=True, nullable=True, index=True)
    phone = Column(String(50), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    
    # Profile
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    date_of_birth = Column(DateTime, nullable=True)
    
    # Address
    residence_city = Column(String(100))
    address = Column(String(500))
    country = Column(String(100))
    
    # Role
    user_type = Column(SQLEnum(UserRole), nullable=False, default=UserRole.SENDER)
    
    # Verification
    is_phone_verified = Column(Boolean, default=False)
    is_email_verified = Column(Boolean, default=False)
    verification_status = Column(SQLEnum(VerificationStatus), default=VerificationStatus.UNVERIFIED)
    
    # Status
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    last_login = Column(DateTime, nullable=True)
    
    # Relationships
    kyc_documents = relationship("KYCDocument", back_populates="user", cascade="all, delete-orphan")
    sent_requests = relationship("DocumentRequest", foreign_keys="DocumentRequest.sender_id", back_populates="sender")
    trips = relationship("Trip", back_populates="traveler", cascade="all, delete-orphan")
    relay_point = relationship("RelayPoint", back_populates="user", uselist=False, cascade="all, delete-orphan")
    security_logs = relationship("SecurityLog", back_populates="user", cascade="all, delete-orphan")
    
    @property
    def full_name(self) -> str:
        """Get user's full name"""
        return f"{self.first_name} {self.last_name}"
    
    @property
    def is_verified(self) -> bool:
        """Check if user is fully verified"""
        return self.verification_status == VerificationStatus.VERIFIED
