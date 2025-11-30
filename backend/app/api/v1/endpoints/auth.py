"""Authentication endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.schemas.auth import (
    UserRegister,
    UserLogin,
    Token,
    TokenRefresh,
    ForgotPassword,
    ResetPassword
)
from app.schemas.user import UserResponse
from app.schemas.common import MessageResponse
from app.services.auth_service import AuthService


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(
    user_data: UserRegister,
    db: Session = Depends(get_db)
):
    """Register a new user"""
    user = AuthService.register_user(db, user_data)
    return user


@router.post("/login", response_model=Token)
def login(
    login_data: UserLogin,
    db: Session = Depends(get_db)
):
    """Login and get access token"""
    user = AuthService.authenticate_user(db, login_data)
    tokens = AuthService.create_tokens(user)
    return tokens


@router.post("/refresh-token", response_model=Token)
def refresh_token(
    token_data: TokenRefresh,
    db: Session = Depends(get_db)
):
    """Refresh access token"""
    tokens = AuthService.refresh_access_token(db, token_data.refresh_token)
    return tokens


@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(
    data: ForgotPassword,
    db: Session = Depends(get_db)
):
    """Initiate password reset"""
    message = AuthService.initiate_password_reset(db, data.email)
    return MessageResponse(message=message)


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(
    data: ResetPassword,
    db: Session = Depends(get_db)
):
    """Reset password with token"""
    message = AuthService.reset_password(db, data.token, data.new_password)
    return MessageResponse(message=message)
