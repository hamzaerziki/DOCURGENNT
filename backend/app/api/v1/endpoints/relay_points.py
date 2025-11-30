"""Relay Point workflow API endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.document_request import RequestStatus
from app.schemas.relay_point import (
    CheckInRequest,
    CheckInResponse,
    VerifyTravelerRequest,
    HandoffRequest,
    HandoffResponse
)
from app.services.shipment_service import ShipmentService
from app.services.code_service import CodeService


router = APIRouter(prefix="/relay-points", tags=["Relay Points"])


@router.post("/check-in", response_model=CheckInResponse)
def check_in_sender(
    request: CheckInRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Sender checks in at relay point
    
    Workflow Step 2: Sender → Relay Point
    - Verifies sender identity
    - Verifies unique_code (DOCXXXXX)
    - Updates status to AT_RELAY_POINT
    """
    # Verify unique code
    if not CodeService.verify_unique_code(db, request.shipment_id, request.unique_code):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid unique code"
        )
    
    # Get shipment
    shipment = ShipmentService.get_shipment(db, request.shipment_id)
    
    if not shipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shipment not found"
        )
    
    # Check status
    if shipment.status != RequestStatus.CREATED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot check in shipment in status {shipment.status.value}"
        )
    
    # Update status
    shipment = ShipmentService.update_status(
        db,
        request.shipment_id,
        RequestStatus.AT_RELAY_POINT,
        current_user.id,
        notes=request.notes or "Sender checked in at relay point"
    )
    
    return CheckInResponse(
        success=True,
        message="Sender checked in successfully. Envelope stored at relay point.",
        shipment_id=shipment.id,
        new_status=shipment.status.value
    )


@router.post("/verify-traveler", response_model=dict)
def verify_traveler(
    request: VerifyTravelerRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Verify traveler identity and code before handoff
    
    Workflow Step 3a: Traveler shows ID and provides traveler_code
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
    
    # Verify traveler is assigned to this shipment
    if shipment.traveler_id != request.traveler_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Traveler not assigned to this shipment"
        )
    
    return {
        "success": True,
        "message": "Traveler verified successfully",
        "traveler_id": request.traveler_id,
        "shipment_id": request.shipment_id
    }


@router.post("/handoff", response_model=HandoffResponse)
def handoff_to_traveler(
    request: HandoffRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Hand off envelope to traveler
    
    Workflow Step 3b: Relay Point → Traveler
    - Final verification
    - Updates status to WITH_TRAVELER
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
    
    # Check status
    if shipment.status != RequestStatus.AT_RELAY_POINT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot hand off shipment in status {shipment.status.value}"
        )
    
    # Update status
    shipment = ShipmentService.update_status(
        db,
        request.shipment_id,
        RequestStatus.WITH_TRAVELER,
        current_user.id,
        notes=request.notes or "Envelope handed to traveler"
    )
    
    # Get traveler info
    traveler = db.query(User).filter(User.id == shipment.traveler_id).first()
    traveler_name = f"{traveler.first_name} {traveler.last_name}" if traveler else "Unknown"
    
    return HandoffResponse(
        success=True,
        message="Envelope handed to traveler successfully",
        shipment_id=shipment.id,
        new_status=shipment.status.value,
        traveler_name=traveler_name
    )
