"""Traveler workflow API endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.document_request import RequestStatus
from app.schemas.traveler import (
    PickupRequest,
    PickupResponse,
    DeliveryRequest,
    DeliveryResponse
)
from app.services.shipment_service import ShipmentService
from app.services.code_service import CodeService


router = APIRouter(prefix="/travelers", tags=["Travelers"])


@router.post("/pickup", response_model=PickupResponse)
def pickup_from_relay_point(
    request: PickupRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Traveler picks up envelope from relay point
    
    Workflow Step 3: Traveler Pickup
    - Provides traveler_code (TRVXXXXX)
    - Confirms pickup
    - Status updated to WITH_TRAVELER (done by relay point handoff)
    """
    # Verify traveler code
    if not CodeService.verify_traveler_code(db, request.shipment_id, request.traveler_code):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid traveler code"
        )
    
    # Get shipment
    shipment = ShipmentService.get_shipment(db, request.shipment_id)
    
    if not shipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shipment not found"
        )
    
    # Verify traveler
    if shipment.traveler_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized for this shipment"
        )
    
    # Check status
    if shipment.status != RequestStatus.WITH_TRAVELER:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Shipment not ready for pickup. Current status: {shipment.status.value}"
        )
    
    return PickupResponse(
        success=True,
        message="Pickup confirmed. You can now deliver to receiver.",
        shipment_id=shipment.id,
        new_status=shipment.status.value
    )


@router.post("/deliver", response_model=DeliveryResponse)
def deliver_to_receiver(
    request: DeliveryRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Traveler delivers envelope to receiver
    
    Workflow Step 4: Delivery to Receiver
    - Receiver provides delivery_code (RCVXXXXX)
    - Traveler enters code to confirm delivery
    - Status updated to DELIVERED
    """
    # Verify delivery code
    if not CodeService.verify_delivery_code(db, request.shipment_id, request.delivery_code):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid delivery code. Please ask receiver for correct code."
        )
    
    # Get shipment
    shipment = ShipmentService.get_shipment(db, request.shipment_id)
    
    if not shipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shipment not found"
        )
    
    # Verify traveler
    if shipment.traveler_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized for this shipment"
        )
    
    # Check status
    if shipment.status != RequestStatus.WITH_TRAVELER:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot deliver shipment in status {shipment.status.value}"
        )
    
    # Update status to DELIVERED
    shipment = ShipmentService.update_status(
        db,
        request.shipment_id,
        RequestStatus.DELIVERED,
        current_user.id,
        notes=request.notes or "Delivered to receiver successfully"
    )
    
    # Mark as completed
    shipment.completed_at = shipment.updated_at
    shipment.completed_by = current_user.id
    db.commit()
    
    return DeliveryResponse(
        success=True,
        message="Delivery confirmed! Shipment completed successfully.",
        shipment_id=shipment.id,
        new_status=shipment.status.value,
        recipient_name=shipment.recipient_name
    )


@router.get("/my-shipments")
def get_my_shipments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all shipments assigned to current traveler"""
    shipments, total = ShipmentService.list_shipments(
        db,
        user_id=current_user.id,
        skip=0,
        limit=100
    )
    
    # Filter to only show shipments where user is traveler
    traveler_shipments = [s for s in shipments if s.traveler_id == current_user.id]
    
    return {
        "total": len(traveler_shipments),
        "shipments": traveler_shipments
    }
