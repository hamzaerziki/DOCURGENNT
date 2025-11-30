"""Payment and transaction models"""
from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Enum as SQLEnum, Boolean
from sqlalchemy.orm import relationship
import enum
from datetime import datetime

from app.database.database import Base


class PaymentStatus(str, enum.Enum):
    """Payment status"""
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"
    ESCROWED = "escrowed"
    RELEASED = "released"


class PaymentMethod(str, enum.Enum):
    """Payment methods"""
    STRIPE = "stripe"
    PAYPAL = "paypal"
    CARD = "card"


class Payment(Base):
    """Payment model for escrow system"""
    __tablename__ = "payments"
    
    id = Column(String(36), primary_key=True)
    document_request_id = Column(String(36), ForeignKey('document_requests.id'), nullable=False)
    sender_id = Column(String(36), ForeignKey('users.id'), nullable=False)
    traveler_id = Column(String(36), ForeignKey('users.id'), nullable=True)
    
    # Amount in cents to avoid float issues
    amount_cents = Column(Integer, nullable=False)
    currency = Column(String(3), default="EUR")
    
    # Payment provider
    payment_method = Column(SQLEnum(PaymentMethod), nullable=False)
    stripe_payment_intent_id = Column(String(255), unique=True, nullable=True)
    stripe_session_id = Column(String(255), unique=True, nullable=True)
    
    # Status
    status = Column(SQLEnum(PaymentStatus), nullable=False, default=PaymentStatus.PENDING)
    
    # Escrow
    is_escrowed = Column(Boolean, default=False)
    escrowed_at = Column(DateTime, nullable=True)
    released_at = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    document_request = relationship("DocumentRequest")
    sender = relationship("User", foreign_keys=[sender_id])
    traveler = relationship("User", foreign_keys=[traveler_id])
    
    @property
    def amount_euros(self) -> float:
        """Get amount in euros"""
        return self.amount_cents / 100
