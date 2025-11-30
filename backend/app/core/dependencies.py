"""FastAPI dependencies for database, authentication, and authorization"""
from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.core.security import decode_token, verify_token_type
from app.models.user import User


# HTTP Bearer token scheme
security = HTTPBearer()


def get_db() -> Generator:
    """Database session dependency"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Get current authenticated user from JWT token"""
    token = credentials.credentials
    payload = decode_token(token)
    verify_token_type(payload, "access")
    
    user_id: str = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )
    
    # DocUrgent uses UUID strings, not integers
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )
    
    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Get current active user"""
    return current_user


class UserTypeChecker:
    """Dependency to check if user has required user type"""
    
    def __init__(self, allowed_types: list[str]):
        self.allowed_types = allowed_types
    
    def __call__(self, current_user: User = Depends(get_current_user)) -> User:
        user_type = current_user.user_type.value if hasattr(current_user.user_type, 'value') else current_user.user_type
        if user_type not in self.allowed_types:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"User type '{user_type}' not authorized. Required: {self.allowed_types}"
            )
        return current_user


# User type-based dependencies for DocUrgent
require_sender = UserTypeChecker(["sender", "admin"])
require_traveler = UserTypeChecker(["traveler", "admin"])
require_relay_point = UserTypeChecker(["relay_point", "admin"])
require_admin = UserTypeChecker(["admin"])
