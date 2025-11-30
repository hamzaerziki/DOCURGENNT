"""Base model with common fields for all entities"""
from datetime import datetime
from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declared_attr

from app.database.database import Base


class BaseModel(Base):
    """Abstract base model with common fields"""
    __abstract__ = True
    
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    @declared_attr
    def tenant_id(cls):
        """Tenant ID for multi-tenancy (not applied to Tenant model itself)"""
        if cls.__name__ != 'Tenant':
            return Column(Integer, ForeignKey('tenants.id'), nullable=False, index=True)
        return None
