"""Relay Point workflow schemas"""
from pydantic import BaseModel, Field
from typing import Optional


class CheckInRequest(BaseModel):
    """Request to check in sender at relay point"""
    shipment_id: str = Field(..., description="Shipment ID")
    unique_code: str = Field(..., min_length=8, max_length=8, description="8-char unique code (DOCXXXXX)")
    relay_point_id: str = Field(..., description="Relay point ID")
    notes: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "shipment_id": "uuid-here",
                "unique_code": "DOCA2B3C",
                "relay_point_id": "relay-uuid",
                "notes": "Envelope in good condition"
            }
        }


class VerifyTravelerRequest(BaseModel):
    """Request to verify traveler identity"""
    shipment_id: str = Field(..., description="Shipment ID")
    traveler_code: str = Field(..., min_length=8, max_length=8, description="8-char traveler code (TRVXXXXX)")
    traveler_id: str = Field(..., description="Traveler user ID")
    
    class Config:
        json_schema_extra = {
            "example": {
                "shipment_id": "uuid-here",
                "traveler_code": "TRVM6N7P",
                "traveler_id": "traveler-uuid"
            }
        }


class HandoffRequest(BaseModel):
    """Request to hand off envelope to traveler"""
    shipment_id: str = Field(..., description="Shipment ID")
    traveler_code: str = Field(..., min_length=8, max_length=8, description="8-char traveler code (TRVXXXXX)")
    relay_point_id: str = Field(..., description="Relay point ID")
    notes: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "shipment_id": "uuid-here",
                "traveler_code": "TRVM6N7P",
                "relay_point_id": "relay-uuid",
                "notes": "Handed to traveler, ID verified"
            }
        }


class CheckInResponse(BaseModel):
    """Response after successful check-in"""
    success: bool
    message: str
    shipment_id: str
    new_status: str


class HandoffResponse(BaseModel):
    """Response after successful handoff"""
    success: bool
    message: str
    shipment_id: str
    new_status: str
    traveler_name: str
