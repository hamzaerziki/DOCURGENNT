"""Rate limiting middleware"""
from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from app.utils.redis_client import redis_client
from app.core.config import settings


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Rate limiting middleware using Redis"""
    
    async def dispatch(self, request: Request, call_next):
        # Skip rate limiting for health check
        if request.url.path == "/health":
            return await call_next(request)
        
        # Get client IP
        client_ip = request.client.host
        
        # Create rate limit key
        key = f"rate_limit:{client_ip}"
        
        # Get current count
        count = redis_client.get(key)
        
        if count is None:
            # First request in window
            redis_client.set(key, 1, expire=60)
        elif int(count) >= settings.RATE_LIMIT_PER_MINUTE:
            # Rate limit exceeded
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded. Please try again later."
            )
        else:
            # Increment count
            redis_client.increment(key)
        
        response = await call_next(request)
        return response
