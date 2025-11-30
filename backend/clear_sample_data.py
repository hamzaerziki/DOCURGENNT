#!/usr/bin/env python3
"""
Clear Sample Data Script

This script removes all sample/mock data from the DocUrgent database,
leaving the tables intact but empty for production use.

Usage:
    python clear_sample_data.py
"""

import sys
from pathlib import Path

# Add the app directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

from sqlalchemy import text
from app.database.database import SessionLocal, engine
from app.core.config import settings


def print_banner():
    """Print banner"""
    print("=" * 70)
    print("  DocUrgent - Clear Sample Data")
    print("=" * 70)
    print()


def get_table_counts(db):
    """Get count of records in each table"""
    tables = [
        'users', 'trips', 'relay_points', 'document_requests',
        'delivery_steps', 'otp_verifications', 'kyc_documents',
        'payments', 'conversations', 'messages', 'security_logs'
    ]
    
    counts = {}
    for table in tables:
        result = db.execute(text(f"SELECT COUNT(*) FROM {table}"))
        counts[table] = result.scalar()
    
    return counts


def clear_all_data(db):
    """Clear all data from all tables"""
    print("🗑️  Clearing all data from tables...")
    print()
    
    # Order matters due to foreign key constraints
    # Delete in reverse order of dependencies
    tables_in_order = [
        'security_logs',
        'messages',
        'conversations',
        'payments',
        'delivery_steps',
        'kyc_documents',
        'otp_verifications',
        'document_requests',
        'trips',
        'relay_points',
        'users'
    ]
    
    try:
        for table in tables_in_order:
            result = db.execute(text(f"DELETE FROM {table}"))
            deleted = result.rowcount
            print(f"  ✅ Cleared {table}: {deleted} records deleted")
        
        db.commit()
        print()
        print("✅ All sample data cleared successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error clearing data: {str(e)}")
        db.rollback()
        return False


def main():
    """Main function"""
    print_banner()
    
    # Create database session
    db = SessionLocal()
    
    try:
        # Show current counts
        print("📊 Current Database Status:")
        print()
        counts = get_table_counts(db)
        total = sum(counts.values())
        
        for table, count in counts.items():
            if count > 0:
                print(f"  {table}: {count} records")
        
        print()
        print(f"Total records: {total}")
        print()
        
        if total == 0:
            print("✅ Database is already empty!")
            return
        
        # Confirm deletion
        response = input("⚠️  This will DELETE ALL DATA. Continue? (yes/no): ")
        if response.lower() not in ['yes', 'y']:
            print("❌ Operation cancelled by user")
            return
        
        print()
        
        # Clear all data
        if clear_all_data(db):
            print()
            print("=" * 70)
            print("✅ Database is now clean and ready for production use!")
            print("=" * 70)
            print()
            print("Next steps:")
            print("  1. Create real users through the API")
            print("  2. Test user registration: POST /api/v1/auth/register")
            print("  3. Verify users in database")
            print()
        
    finally:
        db.close()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n❌ Operation cancelled by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n\n❌ Unexpected error: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
