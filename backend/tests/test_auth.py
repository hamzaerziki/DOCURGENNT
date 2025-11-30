"""Tests for authentication endpoints"""
import pytest
from fastapi import status


def test_health_check(client):
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["status"] == "healthy"
    assert "app" in data
    assert "version" in data


def test_root_endpoint(client):
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "message" in data
    assert "version" in data


def test_register_user(client):
    """Test user registration"""
    # First create a tenant
    tenant_data = {
        "name": "Test School",
        "domain": "testschool.com",
        "email": "admin@testschool.com",
        "subscription_plan": "basic"
    }
    tenant_response = client.post("/api/v1/tenants", json=tenant_data)
    assert tenant_response.status_code == status.HTTP_201_CREATED
    tenant_id = tenant_response.json()["id"]
    
    # Register user
    user_data = {
        "email": "test@example.com",
        "password": "testpassword123",
        "first_name": "Test",
        "last_name": "User",
        "role": "student",
        "tenant_id": tenant_id
    }
    response = client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["email"] == user_data["email"]
    assert data["first_name"] == user_data["first_name"]
    assert "id" in data


def test_login_user(client):
    """Test user login"""
    # First create tenant and register user
    tenant_data = {
        "name": "Test School",
        "domain": "testschool2.com",
        "email": "admin@testschool2.com"
    }
    tenant_response = client.post("/api/v1/tenants", json=tenant_data)
    tenant_id = tenant_response.json()["id"]
    
    user_data = {
        "email": "login@example.com",
        "password": "testpassword123",
        "first_name": "Login",
        "last_name": "Test",
        "role": "student",
        "tenant_id": tenant_id
    }
    client.post("/api/v1/auth/register", json=user_data)
    
    # Login
    login_data = {
        "email": "login@example.com",
        "password": "testpassword123"
    }
    response = client.post("/api/v1/auth/login", json=login_data)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


def test_login_invalid_credentials(client):
    """Test login with invalid credentials"""
    login_data = {
        "email": "nonexistent@example.com",
        "password": "wrongpassword"
    }
    response = client.post("/api/v1/auth/login", json=login_data)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
