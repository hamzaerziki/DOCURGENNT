#!/usr/bin/env python3
"""
Check Database Contents

Quick script to view current database contents and verify user creation.
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

from sqlalchemy import text
from app.database.database import SessionLocal


def main():
    db = SessionLocal()
    
    try:
        print("=" * 70)
        print("  DocUrgent Database Status")
        print("=" * 70)
        print()
        
        # Check users
        print("📊 Users Table:")
        result = db.execute(text("""
            SELECT id, phone, email, first_name, last_name, user_type, 
                   is_phone_verified, verification_status, created_at 
            FROM users 
            ORDER BY created_at DESC
        """))
        
        users = result.fetchall()
        
        if users:
            print(f"\n  Total users: {len(users)}\n")
            for user in users:
                print(f"  ID: {user[0][:8]}...")
                print(f"  Phone: {user[1]}")
                print(f"  Email: {user[2]}")
                print(f"  Name: {user[3]} {user[4]}")
                print(f"  Type: {user[5]}")
                print(f"  Phone Verified: {user[6]}")
                print(f"  Status: {user[7]}")
                print(f"  Created: {user[8]}")
                print()
        else:
            print("  ✅ No users found - database is clean")
            print()
        
        # Check all tables
        print("📋 All Tables Status:")
        print()
        
        tables = [
            'users', 'trips', 'relay_points', 'document_requests',
            'delivery_steps', 'otp_verifications', 'kyc_documents',
            'payments', 'conversations', 'messages', 'security_logs'
        ]
        
        for table in tables:
            result = db.execute(text(f"SELECT COUNT(*) FROM {table}"))
            count = result.scalar()
            status = "✅" if count == 0 else f"📝 {count} records"
            print(f"  {table:20} {status}")
        
        print()
        print("=" * 70)
        
    finally:
        db.close()


if __name__ == "__main__":
    main()
