"""OTP verification model"""
from sqlalchemy import Column, String, Boolean, ForeignKey, DateTime, Integer
from sqlalchemy.orm import relationship
from datetime import datetime, timedelta

from app.database.database import Base


class OTPVerification(Base):
    """OTP verification for phone numbers"""
    __tablename__ = "otp_verifications"
    
    id = Column(String(36), primary_key=True)
    user_id = Column(String(36), ForeignKey('users.id'), nullable=True)
    
    # Phone number
    phone_number = Column(String(50), nullable=False, index=True)
    
    # OTP code
    otp_code = Column(String(10), nullable=False)
    
    # Verification
    is_verified = Column(Boolean, default=False)
    verified_at = Column(DateTime, nullable=True)
    
    # Expiry
    expires_at = Column(DateTime, nullable=False)
    
    # Attempts
    attempts = Column(Integer, default=0)
    max_attempts = Column(Integer, default=3)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    user = relationship("User")
    
    @property
    def is_expired(self) -> bool:
        """Check if OTP is expired"""
        return datetime.utcnow() > self.expires_at
    
    @property
    def can_retry(self) -> bool:
        """Check if user can retry"""
        return self.attempts < self.max_attempts
