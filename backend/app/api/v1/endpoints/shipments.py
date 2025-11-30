"""Shipment API endpoints for DocUrgent"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.document_request import RequestStatus
from app.schemas.shipment import (
    ShipmentCreate,
    ShipmentResponse,
    ShipmentWithCodes,
    ShipmentListResponse,
    ShipmentTimeline,
    DeliveryStepResponse
)
from app.services.shipment_service import ShipmentService


router = APIRouter(prefix="/shipments", tags=["Shipments"])


@router.post("", response_model=ShipmentWithCodes, status_code=status.HTTP_201_CREATED)
def create_shipment(
    shipment_data: ShipmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new shipment
    
    Generates all verification codes:
    - unique_code (DOCXXXXX) - For Sender → Relay Point
    - delivery_code (RCVXXXXX) - For Receiver → Traveler
    - traveler_code (TRVXXXXX) - For Traveler → Relay Point
    
    Auto-assigns nearest relay point based on source address
    """
    shipment = ShipmentService.create_shipment(db, current_user.id, shipment_data)
    return ShipmentWithCodes.from_shipment(shipment)


@router.get("/{shipment_id}", response_model=ShipmentResponse)
def get_shipment(
    shipment_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get shipment details by ID"""
    shipment = ShipmentService.get_shipment(db, shipment_id)
    
    if not shipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shipment not found"
        )
    
    # Check if user has access to this shipment
    if shipment.sender_id != current_user.id and shipment.traveler_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this shipment"
        )
    
    return shipment


@router.get("", response_model=ShipmentListResponse)
def list_shipments(
    status_filter: Optional[str] = Query(None, alias="status"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List shipments for current user
    
    Filters:
    - status: Filter by shipment status
    - page: Page number (default: 1)
    - page_size: Items per page (default: 20, max: 100)
    """
    skip = (page - 1) * page_size
    
    # Parse status filter
    status_enum = None
    if status_filter:
        try:
            status_enum = RequestStatus(status_filter)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status: {status_filter}"
            )
    
    shipments, total = ShipmentService.list_shipments(
        db,
        user_id=current_user.id,
        status=status_enum,
        skip=skip,
        limit=page_size
    )
    
    return ShipmentListResponse(
        total=total,
        shipments=shipments,
        page=page,
        page_size=page_size
    )


@router.get("/{shipment_id}/timeline", response_model=ShipmentTimeline)
def get_shipment_timeline(
    shipment_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get complete delivery timeline for shipment"""
    shipment = ShipmentService.get_shipment(db, shipment_id)
    
    if not shipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shipment not found"
        )
    
    # Check access
    if shipment.sender_id != current_user.id and shipment.traveler_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this shipment"
        )
    
    steps = ShipmentService.get_shipment_timeline(db, shipment_id)
    
    return ShipmentTimeline(
        shipment_id=shipment_id,
        current_status=shipment.status.value,
        steps=[DeliveryStepResponse.from_orm(step) for step in steps]
    )


@router.post("/{shipment_id}/assign-traveler", response_model=ShipmentResponse)
def assign_traveler(
    shipment_id: str,
    traveler_id: str,
    trip_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Assign shipment to a traveler and trip"""
    shipment = ShipmentService.get_shipment(db, shipment_id)
    
    if not shipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shipment not found"
        )
    
    # Only sender or the traveler can assign
    if shipment.sender_id != current_user.id and current_user.id != traveler_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to assign this shipment"
        )
    
    return ShipmentService.assign_to_traveler(db, shipment_id, traveler_id, trip_id)


@router.post("/{shipment_id}/cancel", response_model=ShipmentResponse)
def cancel_shipment(
    shipment_id: str,
    reason: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Cancel a shipment"""
    shipment = ShipmentService.get_shipment(db, shipment_id)
    
    if not shipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shipment not found"
        )
    
    # Only sender can cancel
    if shipment.sender_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only sender can cancel shipment"
        )
    
    return ShipmentService.cancel_shipment(db, shipment_id, current_user.id, reason)
