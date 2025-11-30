"""Authentication service for DocUrgent platform"""
from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import secrets
import uuid

from app.models.user import User, UserRole, VerificationStatus
from app.schemas.auth import UserRegister, UserLogin, Token
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    decode_token,
    verify_token_type
)


class AuthService:
    """Authentication service for DocUrgent"""
    
    @staticmethod
    def register_user(db: Session, user_data: UserRegister) -> User:
        """Register a new user for DocUrgent platform"""
        # Check if phone already exists (phone is primary identifier)
        existing_user = db.query(User).filter(User.phone == user_data.phone).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Phone number already registered"
            )
        
        # Check if email already exists (if provided)
        if user_data.email:
            existing_email = db.query(User).filter(User.email == user_data.email).first()
            if existing_email:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered"
                )
        
        # Create new user with DocUrgent schema
        hashed_password = get_password_hash(user_data.password)
        new_user = User(
            id=str(uuid.uuid4()),
            phone=user_data.phone,
            email=user_data.email if user_data.email else None,
            hashed_password=hashed_password,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            user_type=user_data.user_type,  # sender, traveler, relay_point, recipient, admin
            is_phone_verified=False,  # Will be verified via OTP
            is_email_verified=False,
            verification_status=VerificationStatus.UNVERIFIED,
            is_active=True,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return new_user
    
    @staticmethod
    def authenticate_user(db: Session, login_data: UserLogin) -> User:
        """Authenticate user with phone/email and password"""
        # Try to find user by phone or email
        user = None
        if '@' in login_data.identifier:
            # Login with email
            user = db.query(User).filter(User.email == login_data.identifier).first()
        else:
            # Login with phone
            user = db.query(User).filter(User.phone == login_data.identifier).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect phone/email or password"
            )
        
        if not verify_password(login_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect phone/email or password"
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive"
            )
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.commit()
        
        return user
    
    @staticmethod
    def create_tokens(user: User) -> Token:
        """Create access and refresh tokens for user"""
        access_token = create_access_token(
            data={
                "sub": str(user.id), 
                "phone": user.phone,
                "user_type": user.user_type.value if hasattr(user.user_type, 'value') else user.user_type
            }
        )
        refresh_token = create_refresh_token(
            data={"sub": str(user.id)}
        )
        
        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer"
        )
    
    @staticmethod
    def refresh_access_token(db: Session, refresh_token: str) -> Token:
        """Refresh access token using refresh token"""
        payload = decode_token(refresh_token)
        verify_token_type(payload, "refresh")
        
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
        
        user = db.query(User).filter(User.id == user_id).first()
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive"
            )
        
        return AuthService.create_tokens(user)
    
    @staticmethod
    def initiate_password_reset(db: Session, identifier: str) -> str:
        """Initiate password reset process using phone or email"""
        # Try to find user by phone or email
        user = None
        if '@' in identifier:
            user = db.query(User).filter(User.email == identifier).first()
        else:
            user = db.query(User).filter(User.phone == identifier).first()
        
        if not user:
            # Don't reveal if phone/email exists
            return "If the phone/email exists, a reset code has been sent"
        
        # Generate reset token
        reset_token = secrets.token_urlsafe(32)
        # Note: User model doesn't have reset_token fields yet
        # TODO: Add reset_token and reset_token_expires to User model
        # For now, this is a placeholder
        
        db.commit()
        
        # TODO: Send SMS/email with reset token
        
        return "Password reset code sent"
    
    @staticmethod
    def reset_password(db: Session, token: str, new_password: str) -> str:
        """Reset password using reset token"""
        # TODO: Implement when reset_token fields are added to User model
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Password reset not yet implemented"
        )
