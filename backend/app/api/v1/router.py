"""API router configuration for DocUrgent"""
from fastapi import APIRouter

from app.api.v1.endpoints import auth, shipments, relay_points, travelers

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router)
api_router.include_router(shipments.router)
api_router.include_router(relay_points.router)
api_router.include_router(travelers.router)
