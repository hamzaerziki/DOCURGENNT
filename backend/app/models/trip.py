"""Trip model for travelers"""
from sqlalchemy import Column, String, Integer, ForeignKey, Date, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database.database import Base


class Trip(Base):
    """Trip model for travelers"""
    __tablename__ = "trips"
    
    id = Column(String(36), primary_key=True)
    traveler_id = Column(String(36), ForeignKey('users.id'), nullable=False)
    
    # Departure information
    departure_city = Column(String(100), nullable=False)
    departure_date = Column(Date, nullable=False)
    departure_country = Column(String(100), default="France")
    
    # Destination information
    destination_city = Column(String(100), nullable=False)
    destination_country = Column(String(100), nullable=False)
    arrival_date = Column(Date, nullable=True)
    
    # Flight information
    airline = Column(String(100))
    flight_number = Column(String(50))
    
    # Capacity
    spots_available = Column(Integer, default=1)
    spots_taken = Column(Integer, default=0)
    
    # Pricing
    price_per_document = Column(Integer, default=20)  # In euros
    
    # Status
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    traveler = relationship("User", back_populates="trips")
    document_requests = relationship("DocumentRequest", back_populates="trip")
    
    @property
    def has_available_spots(self) -> bool:
        """Check if trip has available spots"""
        return self.spots_taken < self.spots_available
