"""Traveler workflow schemas"""
from pydantic import BaseModel, Field
from typing import Optional


class PickupRequest(BaseModel):
    """Request for traveler to pickup from relay point"""
    shipment_id: str = Field(..., description="Shipment ID")
    traveler_code: str = Field(..., min_length=8, max_length=8, description="8-char traveler code (TRVXXXXX)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "shipment_id": "uuid-here",
                "traveler_code": "TRVM6N7P"
            }
        }


class DeliveryRequest(BaseModel):
    """Request for traveler to deliver to receiver"""
    shipment_id: str = Field(..., description="Shipment ID")
    delivery_code: str = Field(..., min_length=8, max_length=8, description="8-char delivery code from receiver (RCVXXXXX)")
    notes: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "shipment_id": "uuid-here",
                "delivery_code": "RCVX4Y5Z",
                "notes": "Delivered to recipient in person"
            }
        }


class PickupResponse(BaseModel):
    """Response after successful pickup"""
    success: bool
    message: str
    shipment_id: str
    new_status: str


class DeliveryResponse(BaseModel):
    """Response after successful delivery"""
    success: bool
    message: str
    shipment_id: str
    new_status: str
    recipient_name: str
