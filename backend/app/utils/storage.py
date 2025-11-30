"""Storage utilities for MinIO/S3"""
from minio import Minio
from minio.error import S3Error
from typing import Optional
import io

from app.core.config import settings


class StorageClient:
    """MinIO/S3 storage client"""
    
    def __init__(self):
        self.client = Minio(
            settings.MINIO_ENDPOINT,
            access_key=settings.MINIO_ACCESS_KEY,
            secret_key=settings.MINIO_SECRET_KEY,
            secure=settings.MINIO_SECURE
        )
        self.bucket = settings.MINIO_BUCKET
        self._ensure_bucket()
    
    def _ensure_bucket(self):
        """Ensure bucket exists"""
        try:
            if not self.client.bucket_exists(self.bucket):
                self.client.make_bucket(self.bucket)
        except S3Error as e:
            print(f"Error ensuring bucket: {e}")
    
    def upload_file(self, file_data: bytes, object_name: str, content_type: str = "application/octet-stream") -> Optional[str]:
        """Upload file to storage"""
        try:
            self.client.put_object(
                self.bucket,
                object_name,
                io.BytesIO(file_data),
                length=len(file_data),
                content_type=content_type
            )
            return f"{settings.MINIO_ENDPOINT}/{self.bucket}/{object_name}"
        except S3Error as e:
            print(f"Error uploading file: {e}")
            return None
    
    def download_file(self, object_name: str) -> Optional[bytes]:
        """Download file from storage"""
        try:
            response = self.client.get_object(self.bucket, object_name)
            return response.read()
        except S3Error as e:
            print(f"Error downloading file: {e}")
            return None
    
    def delete_file(self, object_name: str) -> bool:
        """Delete file from storage"""
        try:
            self.client.remove_object(self.bucket, object_name)
            return True
        except S3Error as e:
            print(f"Error deleting file: {e}")
            return False
    
    def get_file_url(self, object_name: str, expires: int = 3600) -> Optional[str]:
        """Get presigned URL for file"""
        try:
            return self.client.presigned_get_object(self.bucket, object_name, expires=expires)
        except S3Error as e:
            print(f"Error getting file URL: {e}")
            return None


# Global storage client instance
storage_client = StorageClient()
