"""Shipment schemas for DocUrgent API"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class DocumentTypeEnum(str, Enum):
    """Document type enumeration"""
    PASSPORT_COPY = "passport_copy"
    BIRTH_CERTIFICATE = "birth_certificate"
    MARRIAGE_CERTIFICATE = "marriage_certificate"
    DIPLOMA = "diploma"
    OFFICIAL_DOCUMENT = "official_document"
    OTHER = "other"


class RequestStatusEnum(str, Enum):
    """Shipment status enumeration"""
    CREATED = "created"
    AT_RELAY_POINT = "at_relay_point"
    WITH_TRAVELER = "with_traveler"
    DELIVERED = "delivered"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class ShipmentCreate(BaseModel):
    """Schema for creating a new shipment"""
    sender_name: str = Field(..., min_length=1, max_length=255)
    sender_phone: str = Field(..., min_length=10, max_length=50)
    source_address: str = Field(..., min_length=1, max_length=500)
    recipient_name: str = Field(..., min_length=1, max_length=255)
    recipient_phone: str = Field(..., min_length=10, max_length=50)
    destination_address: str = Field(..., min_length=1, max_length=500)
    document_type: DocumentTypeEnum
    document_description: Optional[str] = None
    offered_price: Optional[str] = "0"
    
    class Config:
        json_schema_extra = {
            "example": {
                "sender_name": "Jean Dupont",
                "sender_phone": "+33612345678",
                "source_address": "123 Rue de Paris, 75001 Paris, France",
                "recipient_name": "Ahmed Benali",
                "recipient_phone": "+212612345678",
                "destination_address": "456 Avenue Mohammed V, Casablanca, Morocco",
                "document_type": "passport_copy",
                "document_description": "Passport copy for visa application",
                "offered_price": "25"
            }
        }


class ShipmentCodes(BaseModel):
    """Verification codes for shipment"""
    unique_code: str = Field(..., description="8-char code for Sender → Relay Point (DOCXXXXX)")
    delivery_code: str = Field(..., description="8-char code for Receiver → Traveler (RCVXXXXX)")
    traveler_code: str = Field(..., description="8-char code for Traveler → Relay Point (TRVXXXXX)")


class ShipmentResponse(BaseModel):
    """Response schema for shipment"""
    id: str
    sender_id: str
    sender_name: str
    sender_phone: str
    source_address: str
    recipient_name: str
    recipient_phone: str
    destination_address: str
    document_type: str
    document_description: Optional[str]
    traveler_id: Optional[str]
    trip_id: Optional[str]
    relay_point_id: Optional[str]
    unique_code: str
    delivery_code: str
    traveler_code: str
    qr_code_url: Optional[str]
    status: str
    offered_price: str
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class ShipmentWithCodes(ShipmentResponse):
    """Shipment response with codes highlighted (for sender)"""
    codes: ShipmentCodes
    
    @classmethod
    def from_shipment(cls, shipment):
        """Create from shipment model"""
        data = {
            **{k: getattr(shipment, k) for k in ShipmentResponse.model_fields.keys()},
            "codes": ShipmentCodes(
                unique_code=shipment.unique_code,
                delivery_code=shipment.delivery_code,
                traveler_code=shipment.traveler_code
            )
        }
        return cls(**data)


class ShipmentUpdate(BaseModel):
    """Schema for updating shipment"""
    status: Optional[RequestStatusEnum] = None
    traveler_id: Optional[str] = None
    trip_id: Optional[str] = None
    relay_point_id: Optional[str] = None


class ShipmentListResponse(BaseModel):
    """Response for list of shipments"""
    total: int
    shipments: List[ShipmentResponse]
    page: int
    page_size: int


class DeliveryStepResponse(BaseModel):
    """Delivery step in shipment timeline"""
    id: str
    step_name: str
    completed: bool
    completed_at: Optional[datetime]
    actor_id: Optional[str]
    notes: Optional[str]
    
    class Config:
        from_attributes = True


class ShipmentTimeline(BaseModel):
    """Complete shipment timeline"""
    shipment_id: str
    current_status: str
    steps: List[DeliveryStepResponse]
