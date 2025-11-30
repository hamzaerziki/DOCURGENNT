"""Redis client utilities"""
import redis
from typing import Optional, Any
import json

from app.core.config import settings


class RedisClient:
    """Redis client wrapper"""
    
    def __init__(self):
        self.client = redis.Redis(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            db=settings.REDIS_DB,
            password=settings.REDIS_PASSWORD if settings.REDIS_PASSWORD else None,
            decode_responses=True
        )
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from Redis"""
        value = self.client.get(key)
        if value:
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                return value
        return None
    
    def set(self, key: str, value: Any, expire: int = None) -> bool:
        """Set value in Redis"""
        if isinstance(value, (dict, list)):
            value = json.dumps(value)
        
        if expire:
            return self.client.setex(key, expire, value)
        return self.client.set(key, value)
    
    def delete(self, key: str) -> bool:
        """Delete key from Redis"""
        return self.client.delete(key) > 0
    
    def exists(self, key: str) -> bool:
        """Check if key exists"""
        return self.client.exists(key) > 0
    
    def increment(self, key: str) -> int:
        """Increment value"""
        return self.client.incr(key)
    
    def expire(self, key: str, seconds: int) -> bool:
        """Set expiration on key"""
        return self.client.expire(key, seconds)


# Global Redis client instance
redis_client = RedisClient()
