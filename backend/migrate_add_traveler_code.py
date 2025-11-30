#!/usr/bin/env python3
"""
Database Migration: Add traveler_code column

This script adds the traveler_code column to existing document_requests table.
Run this ONCE after deploying the new code.

Usage:
    python migrate_add_traveler_code.py
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

from sqlalchemy import text
from app.database.database import SessionLocal, engine
from app.services.code_service import CodeService


def print_banner():
    """Print banner"""
    print("=" * 70)
    print("  DocUrgent - Database Migration")
    print("  Adding traveler_code column")
    print("=" * 70)
    print()


def check_column_exists(db):
    """Check if traveler_code column already exists"""
    result = db.execute(text("""
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='document_requests' 
        AND column_name='traveler_code'
    """))
    return result.fetchone() is not None


def add_traveler_code_column(db):
    """Add traveler_code column to document_requests table"""
    print("🔧 Adding traveler_code column...")
    
    try:
        # Add column
        db.execute(text("""
            ALTER TABLE document_requests 
            ADD COLUMN IF NOT EXISTS traveler_code VARCHAR(20)
        """))
        
        print("✅ Column added successfully")
        return True
        
    except Exception as e:
        print(f"❌ Error adding column: {str(e)}")
        return False


def populate_existing_codes(db):
    """Generate traveler codes for existing shipments"""
    print("\n🔄 Generating codes for existing shipments...")
    
    try:
        # Get shipments without traveler_code
        result = db.execute(text("""
            SELECT id FROM document_requests 
            WHERE traveler_code IS NULL OR traveler_code = ''
        """))
        
        shipments = result.fetchall()
        
        if not shipments:
            print("✅ No existing shipments need codes")
            return True
        
        print(f"   Found {len(shipments)} shipments needing codes")
        
        # Generate and update codes
        for shipment in shipments:
            shipment_id = shipment[0]
            traveler_code = CodeService.generate_traveler_code()
            
            db.execute(text("""
                UPDATE document_requests 
                SET traveler_code = :code 
                WHERE id = :id
            """), {"code": traveler_code, "id": shipment_id})
        
        db.commit()
        print(f"✅ Generated codes for {len(shipments)} shipments")
        return True
        
    except Exception as e:
        print(f"❌ Error generating codes: {str(e)}")
        db.rollback()
        return False


def make_column_not_null(db):
    """Make traveler_code column NOT NULL"""
    print("\n🔒 Making traveler_code NOT NULL...")
    
    try:
        db.execute(text("""
            ALTER TABLE document_requests 
            ALTER COLUMN traveler_code SET NOT NULL
        """))
        
        print("✅ Column constraint updated")
        return True
        
    except Exception as e:
        print(f"❌ Error updating constraint: {str(e)}")
        return False


def main():
    """Main migration function"""
    print_banner()
    
    db = SessionLocal()
    
    try:
        # Check if column already exists
        if check_column_exists(db):
            print("⚠️  traveler_code column already exists!")
            print()
            response = input("Do you want to regenerate codes for existing shipments? (yes/no): ")
            if response.lower() in ['yes', 'y']:
                populate_existing_codes(db)
            print("\n✅ Migration already applied")
            return
        
        # Step 1: Add column (nullable first)
        if not add_traveler_code_column(db):
            print("\n❌ Migration failed at step 1")
            return
        
        db.commit()
        
        # Step 2: Populate existing shipments
        if not populate_existing_codes(db):
            print("\n❌ Migration failed at step 2")
            return
        
        # Step 3: Make column NOT NULL
        if not make_column_not_null(db):
            print("\n❌ Migration failed at step 3")
            return
        
        db.commit()
        
        # Success
        print()
        print("=" * 70)
        print("✅ Migration completed successfully!")
        print("=" * 70)
        print()
        print("Next steps:")
        print("  1. Restart the backend server")
        print("  2. Test shipment creation")
        print("  3. Verify all 3 codes are generated (unique, delivery, traveler)")
        print()
        
    except Exception as e:
        print(f"\n\n❌ Unexpected error: {str(e)}")
        db.rollback()
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n❌ Migration cancelled by user")
        sys.exit(0)
