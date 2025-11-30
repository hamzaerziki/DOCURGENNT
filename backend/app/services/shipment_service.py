"""Shipment service for DocUrgent workflow"""
import uuid
from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import datetime

from app.models.document_request import DocumentRequest, RequestStatus, DocumentType
from app.models.delivery_step import DeliveryStep
from app.models.relay_point import RelayPoint
from app.services.code_service import CodeService
from app.schemas.shipment import ShipmentCreate, ShipmentUpdate


class ShipmentService:
    """Service for managing shipments"""
    
    @staticmethod
    def create_shipment(db: Session, sender_id: str, shipment_data: ShipmentCreate) -> DocumentRequest:
        """
        Create a new shipment with all verification codes
        Auto-assigns relay point based on source address
        """
        # Generate all verification codes (8-char alphanumeric)
        unique_code = CodeService.generate_unique_code()  # DOCXXXXX
        delivery_code = CodeService.generate_delivery_code()  # RCVXXXXX
        traveler_code = CodeService.generate_traveler_code()  # TRVXXXXX
        
        # Auto-assign relay point based on source address
        relay_point = ShipmentService._find_nearest_relay_point(db, shipment_data.source_address)
        
        # Create shipment
        shipment = DocumentRequest(
            id=str(uuid.uuid4()),
            sender_id=sender_id,
            sender_name=shipment_data.sender_name,
            sender_phone=shipment_data.sender_phone,
            source_address=shipment_data.source_address,
            recipient_name=shipment_data.recipient_name,
            recipient_phone=shipment_data.recipient_phone,
            destination_address=shipment_data.destination_address,
            document_type=DocumentType(shipment_data.document_type),
            document_description=shipment_data.document_description,
            unique_code=unique_code,
            delivery_code=delivery_code,
            traveler_code=traveler_code,
            relay_point_id=relay_point.id if relay_point else None,
            status=RequestStatus.CREATED,
            offered_price=shipment_data.offered_price or "0",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        db.add(shipment)
        db.flush()  # Get the ID without committing
        
        # Create initial delivery step
        initial_step = DeliveryStep(
            id=str(uuid.uuid4()),
            document_request_id=shipment.id,
            step_name="Shipment Created",
            completed=True,
            completed_at=datetime.utcnow(),
            actor_id=sender_id,
            notes=f"Shipment created by {shipment_data.sender_name}"
        )
        
        db.add(initial_step)
        db.commit()
        db.refresh(shipment)
        
        return shipment
    
    @staticmethod
    def get_shipment(db: Session, shipment_id: str) -> Optional[DocumentRequest]:
        """Get shipment by ID"""
        return db.query(DocumentRequest).filter(DocumentRequest.id == shipment_id).first()
    
    @staticmethod
    def list_shipments(
        db: Session, 
        user_id: Optional[str] = None,
        status: Optional[RequestStatus] = None,
        skip: int = 0,
        limit: int = 20
    ) -> tuple[List[DocumentRequest], int]:
        """List shipments with filters"""
        query = db.query(DocumentRequest)
        
        if user_id:
            # Show shipments where user is sender or traveler
            query = query.filter(
                (DocumentRequest.sender_id == user_id) | 
                (DocumentRequest.traveler_id == user_id)
            )
        
        if status:
            query = query.filter(DocumentRequest.status == status)
        
        total = query.count()
        shipments = query.order_by(DocumentRequest.created_at.desc()).offset(skip).limit(limit).all()
        
        return shipments, total
    
    @staticmethod
    def update_status(
        db: Session, 
        shipment_id: str, 
        new_status: RequestStatus,
        actor_id: str,
        notes: Optional[str] = None
    ) -> DocumentRequest:
        """Update shipment status and create delivery step"""
        shipment = ShipmentService.get_shipment(db, shipment_id)
        
        if not shipment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Shipment not found"
            )
        
        # Update status
        old_status = shipment.status
        shipment.status = new_status
        shipment.updated_at = datetime.utcnow()
        
        # Create delivery step
        step = DeliveryStep(
            id=str(uuid.uuid4()),
            document_request_id=shipment_id,
            step_name=f"Status changed to {new_status.value}",
            completed=True,
            completed_at=datetime.utcnow(),
            actor_id=actor_id,
            notes=notes or f"Status changed from {old_status.value} to {new_status.value}"
        )
        
        db.add(step)
        db.commit()
        db.refresh(shipment)
        
        return shipment
    
    @staticmethod
    def assign_to_traveler(
        db: Session,
        shipment_id: str,
        traveler_id: str,
        trip_id: str
    ) -> DocumentRequest:
        """Assign shipment to a traveler and trip"""
        shipment = ShipmentService.get_shipment(db, shipment_id)
        
        if not shipment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Shipment not found"
            )
        
        if shipment.status != RequestStatus.CREATED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot assign shipment in status {shipment.status.value}"
            )
        
        shipment.traveler_id = traveler_id
        shipment.trip_id = trip_id
        shipment.updated_at = datetime.utcnow()
        
        # Create delivery step
        step = DeliveryStep(
            id=str(uuid.uuid4()),
            document_request_id=shipment_id,
            step_name="Assigned to Traveler",
            completed=True,
            completed_at=datetime.utcnow(),
            actor_id=traveler_id,
            notes="Shipment assigned to traveler"
        )
        
        db.add(step)
        db.commit()
        db.refresh(shipment)
        
        return shipment
    
    @staticmethod
    def cancel_shipment(
        db: Session,
        shipment_id: str,
        actor_id: str,
        reason: str
    ) -> DocumentRequest:
        """Cancel a shipment"""
        shipment = ShipmentService.get_shipment(db, shipment_id)
        
        if not shipment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Shipment not found"
            )
        
        if shipment.status in [RequestStatus.DELIVERED, RequestStatus.COMPLETED]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot cancel completed shipment"
            )
        
        shipment.status = RequestStatus.CANCELLED
        shipment.updated_at = datetime.utcnow()
        
        # Create delivery step
        step = DeliveryStep(
            id=str(uuid.uuid4()),
            document_request_id=shipment_id,
            step_name="Shipment Cancelled",
            completed=True,
            completed_at=datetime.utcnow(),
            actor_id=actor_id,
            notes=f"Cancelled: {reason}"
        )
        
        db.add(step)
        db.commit()
        db.refresh(shipment)
        
        return shipment
    
    @staticmethod
    def get_shipment_timeline(db: Session, shipment_id: str) -> List[DeliveryStep]:
        """Get complete delivery timeline for shipment"""
        return db.query(DeliveryStep).filter(
            DeliveryStep.document_request_id == shipment_id
        ).order_by(DeliveryStep.completed_at).all()
    
    @staticmethod
    def _find_nearest_relay_point(db: Session, address: str) -> Optional[RelayPoint]:
        """
        Find nearest relay point based on address
        For now, returns first active relay point
        TODO: Implement geolocation-based matching
        """
        return db.query(RelayPoint).filter(RelayPoint.is_active == True).first()
