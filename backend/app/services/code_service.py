"""Code generation and verification service for DocUrgent"""
import random
import string
from typing import Optional
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.models.document_request import DocumentRequest


class CodeService:
    """Service for generating and verifying delivery codes"""
    
    @staticmethod
    def generate_code(prefix: str = "") -> str:
        """
        Generate 8-character alphanumeric code
        Format: PREFIX + random alphanumeric (total 8 chars)
        Example: DOC12AB3, TRAV4CD5, RECV6EF7
        """
        # Use uppercase letters and digits for clarity
        chars = string.ascii_uppercase + string.digits
        # Remove confusing characters (0, O, I, 1, etc.)
        chars = chars.replace('0', '').replace('O', '').replace('I', '').replace('1', '')
        
        if prefix:
            # If prefix provided, fill remaining chars
            remaining_length = 8 - len(prefix)
            random_part = ''.join(random.choices(chars, k=remaining_length))
            return prefix + random_part
        else:
            # Generate full 8-character code
            return ''.join(random.choices(chars, k=8))
    
    @staticmethod
    def generate_unique_code() -> str:
        """
        Generate unique code for Sender → Relay Point verification
        Format: DOC + 5 random chars = 8 total
        Example: DOCA2B3C
        """
        return CodeService.generate_code("DOC")
    
    @staticmethod
    def generate_delivery_code() -> str:
        """
        Generate delivery code for Receiver → Traveler confirmation
        Format: RCV + 5 random chars = 8 total
        Example: RCVX4Y5Z
        """
        return CodeService.generate_code("RCV")
    
    @staticmethod
    def generate_traveler_code() -> str:
        """
        Generate traveler code for Traveler → Relay Point verification
        Format: TRV + 5 random chars = 8 total
        Example: TRVM6N7P
        """
        return CodeService.generate_code("TRV")
    
    @staticmethod
    def verify_unique_code(db: Session, shipment_id: str, code: str) -> bool:
        """Verify unique code for relay point check-in"""
        shipment = db.query(DocumentRequest).filter(
            DocumentRequest.id == shipment_id,
            DocumentRequest.unique_code == code
        ).first()
        return shipment is not None
    
    @staticmethod
    def verify_delivery_code(db: Session, shipment_id: str, code: str) -> bool:
        """Verify delivery code for final delivery"""
        shipment = db.query(DocumentRequest).filter(
            DocumentRequest.id == shipment_id,
            DocumentRequest.delivery_code == code
        ).first()
        return shipment is not None
    
    @staticmethod
    def verify_traveler_code(db: Session, shipment_id: str, code: str) -> bool:
        """Verify traveler code for pickup from relay point"""
        shipment = db.query(DocumentRequest).filter(
            DocumentRequest.id == shipment_id
        ).first()
        
        if not shipment:
            return False
        
        # Check if shipment has traveler_code field and it matches
        return hasattr(shipment, 'traveler_code') and shipment.traveler_code == code
    
    @staticmethod
    def generate_qr_code_data(shipment_id: str, code: str, code_type: str) -> dict:
        """
        Generate QR code data for scanning
        Returns dict that can be encoded to QR code
        """
        return {
            "shipment_id": shipment_id,
            "code": code,
            "code_type": code_type,
            "timestamp": datetime.utcnow().isoformat()
        }
vice = CodeService()
