"""Message and conversation models for chat"""
from sqlalchemy import Column, String, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database.database import Base


class Conversation(Base):
    """Conversation model for chat between users"""
    __tablename__ = "conversations"
    
    id = Column(String(36), primary_key=True)
    document_request_id = Column(String(36), ForeignKey('document_requests.id'), nullable=False)
    
    # Participants
    participant_1_id = Column(String(36), ForeignKey('users.id'), nullable=False)
    participant_2_id = Column(String(36), ForeignKey('users.id'), nullable=False)
    
    # Status
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    document_request = relationship("DocumentRequest")
    participant_1 = relationship("User", foreign_keys=[participant_1_id])
    participant_2 = relationship("User", foreign_keys=[participant_2_id])
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")


class Message(Base):
    """Message model for chat"""
    __tablename__ = "messages"
    
    id = Column(String(36), primary_key=True)
    conversation_id = Column(String(36), ForeignKey('conversations.id'), nullable=False)
    sender_id = Column(String(36), ForeignKey('users.id'), nullable=False)
    
    # Content
    content = Column(Text, nullable=False)
    
    # Status
    is_read = Column(Boolean, default=False)
    read_at = Column(DateTime, nullable=True)
    
    # Timestamp
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    conversation = relationship("Conversation", back_populates="messages")
    sender = relationship("User")
