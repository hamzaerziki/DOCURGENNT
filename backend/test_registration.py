#!/usr/bin/env python3
"""
Test User Registration

Quick script to test if user registration is working correctly.
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

import requests
import json

# API base URL
BASE_URL = "http://localhost:8000/api/v1"

def test_registration():
    """Test user registration endpoint"""
    print("=" * 70)
    print("  Testing User Registration")
    print("=" * 70)
    print()
    
    # Test data
    test_user = {
        "phone": "+33612345678",
        "password": "testpassword123",
        "first_name": "Test",
        "last_name": "User",
        "email": "test@example.com",
        "user_type": "sender"
    }
    
    print("📝 Attempting to register user:")
    print(f"   Phone: {test_user['phone']}")
    print(f"   Name: {test_user['first_name']} {test_user['last_name']}")
    print(f"   Email: {test_user['email']}")
    print(f"   Type: {test_user['user_type']}")
    print()
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/register",
            json=test_user,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status Code: {response.status_code}")
        print()
        
        if response.status_code == 201:
            print("✅ SUCCESS! User registered successfully!")
            print()
            print("Response:")
            print(json.dumps(response.json(), indent=2))
            print()
            print("🎉 User was saved to database!")
            return True
        else:
            print("❌ FAILED! Registration failed.")
            print()
            print("Error Response:")
            print(json.dumps(response.json(), indent=2))
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ ERROR: Cannot connect to backend server")
        print("   Make sure the server is running on http://localhost:8000")
        return False
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return False


def test_login():
    """Test user login endpoint"""
    print()
    print("=" * 70)
    print("  Testing User Login")
    print("=" * 70)
    print()
    
    login_data = {
        "identifier": "+33612345678",  # Can be phone or email
        "password": "testpassword123"
    }
    
    print("📝 Attempting to login:")
    print(f"   Identifier: {login_data['identifier']}")
    print()
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json=login_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status Code: {response.status_code}")
        print()
        
        if response.status_code == 200:
            print("✅ SUCCESS! Login successful!")
            print()
            print("Tokens received:")
            data = response.json()
            print(f"   Access Token: {data['access_token'][:50]}...")
            print(f"   Refresh Token: {data['refresh_token'][:50]}...")
            return True
        else:
            print("❌ FAILED! Login failed.")
            print()
            print("Error Response:")
            print(json.dumps(response.json(), indent=2))
            return False
            
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return False


if __name__ == "__main__":
    print()
    
    # Test registration
    reg_success = test_registration()
    
    if reg_success:
        # Test login
        test_login()
    
    print()
    print("=" * 70)
    print()
    
    if reg_success:
        print("✅ All tests passed! Registration is working correctly.")
        print()
        print("Next steps:")
        print("  1. Check database: python check_database.py")
        print("  2. Try registering via UI")
        print("  3. Create different user types (traveler, relay_point)")
    else:
        print("❌ Tests failed. Check the error messages above.")
        print()
        print("Troubleshooting:")
        print("  1. Make sure backend server is running")
        print("  2. Check backend logs for errors")
        print("  3. Verify database connection")
    
    print()
