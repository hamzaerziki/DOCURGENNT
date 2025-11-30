#!/usr/bin/env python3
"""
DocUrgent Database Initialization Script

This script creates all database tables with proper relationships,
foreign keys, and indexes for the DocUrgent platform.

Usage:
    python init_database.py

Requirements:
    - PostgreSQL database running
    - .env file configured with DATABASE_URL
    - Virtual environment activated with dependencies installed
"""

import sys
import os
from pathlib import Path

# Add the app directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

from sqlalchemy import create_engine, inspect, text
from sqlalchemy.exc import SQLAlchemyError
from app.core.config import settings
from app.database.database import Base, engine

# Import all models to register them with Base
from app.models.user import User, UserRole, VerificationStatus
from app.models.trip import Trip
from app.models.relay_point import RelayPoint
from app.models.document_request import DocumentRequest, RequestStatus, DocumentType
from app.models.delivery_step import DeliveryStep
from app.models.otp_verification import OTPVerification
from app.models.kyc_document import KYCDocument, DocumentTypeKYC
from app.models.payment import Payment, PaymentStatus, PaymentMethod
from app.models.message import Conversation, Message
from app.models.security_log import SecurityLog


def print_banner():
    """Print initialization banner"""
    print("=" * 70)
    print("  DocUrgent Database Initialization")
    print("=" * 70)
    print()


def check_database_connection():
    """Check if database connection is working"""
    print("🔍 Checking database connection...")
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT version();"))
            version = result.fetchone()[0]
            print(f"✅ Connected to PostgreSQL: {version[:50]}...")
            return True
    except SQLAlchemyError as e:
        print(f"❌ Database connection failed: {str(e)}")
        print("\nPlease ensure:")
        print("  1. PostgreSQL is running")
        print("  2. DATABASE_URL in .env is correct")
        print(f"  3. Current DATABASE_URL: {settings.DATABASE_URL[:30]}...")
        return False


def get_existing_tables():
    """Get list of existing tables in database"""
    inspector = inspect(engine)
    return inspector.get_table_names()


def drop_all_tables():
    """Drop all existing tables (use with caution!)"""
    print("\n⚠️  Dropping all existing tables...")
    try:
        Base.metadata.drop_all(bind=engine)
        print("✅ All tables dropped successfully")
        return True
    except SQLAlchemyError as e:
        print(f"❌ Failed to drop tables: {str(e)}")
        return False


def create_all_tables():
    """Create all tables defined in models"""
    print("\n🏗️  Creating database tables...")
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ All tables created successfully")
        return True
    except SQLAlchemyError as e:
        print(f"❌ Failed to create tables: {str(e)}")
        return False


def verify_tables():
    """Verify that all tables were created"""
    print("\n🔍 Verifying created tables...")
    
    expected_tables = [
        'users',
        'trips',
        'relay_points',
        'document_requests',
        'delivery_steps',
        'otp_verifications',
        'kyc_documents',
        'payments',
        'conversations',
        'messages',
        'security_logs'
    ]
    
    existing_tables = get_existing_tables()
    
    print(f"\n📊 Expected tables: {len(expected_tables)}")
    print(f"📊 Created tables: {len(existing_tables)}")
    print()
    
    all_present = True
    for table in expected_tables:
        if table in existing_tables:
            print(f"  ✅ {table}")
        else:
            print(f"  ❌ {table} - MISSING!")
            all_present = False
    
    return all_present


def show_table_details():
    """Show details about created tables"""
    print("\n📋 Table Details:")
    print("-" * 70)
    
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    
    for table_name in sorted(tables):
        columns = inspector.get_columns(table_name)
        foreign_keys = inspector.get_foreign_keys(table_name)
        indexes = inspector.get_indexes(table_name)
        
        print(f"\n🗂️  {table_name.upper()}")
        print(f"   Columns: {len(columns)}")
        print(f"   Foreign Keys: {len(foreign_keys)}")
        print(f"   Indexes: {len(indexes)}")
        
        # Show primary key
        pk_columns = inspector.get_pk_constraint(table_name)
        if pk_columns and pk_columns.get('constrained_columns'):
            print(f"   Primary Key: {', '.join(pk_columns['constrained_columns'])}")
        
        # Show foreign keys
        if foreign_keys:
            print("   Foreign Keys:")
            for fk in foreign_keys:
                ref_table = fk['referred_table']
                local_cols = ', '.join(fk['constrained_columns'])
                ref_cols = ', '.join(fk['referred_columns'])
                print(f"     - {local_cols} → {ref_table}({ref_cols})")


def create_sample_data():
    """Create sample data for testing (optional)"""
    print("\n📝 Creating sample data...")
    
    from app.database.database import SessionLocal
    from datetime import datetime, timedelta
    import uuid
    from passlib.context import CryptContext
    
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    db = SessionLocal()
    
    try:
        # Check if data already exists
        existing_users = db.query(User).count()
        if existing_users > 0:
            print(f"⚠️  Database already contains {existing_users} users. Skipping sample data creation.")
            return True
        
        # Create sample users
        print("  Creating sample users...")
        
        # 1. Admin user
        admin = User(
            id=str(uuid.uuid4()),
            email="admin@docurgent.com",
            phone="+33600000001",
            hashed_password=pwd_context.hash("admin123"),
            first_name="Admin",
            last_name="DocUrgent",
            user_type=UserRole.ADMIN,
            is_phone_verified=True,
            is_email_verified=True,
            verification_status=VerificationStatus.VERIFIED,
            residence_city="Paris",
            country="France"
        )
        db.add(admin)
        
        # 2. Sender user
        sender = User(
            id=str(uuid.uuid4()),
            email="sender@example.com",
            phone="+33600000002",
            hashed_password=pwd_context.hash("sender123"),
            first_name="Jean",
            last_name="Dupont",
            user_type=UserRole.SENDER,
            is_phone_verified=True,
            verification_status=VerificationStatus.VERIFIED,
            residence_city="Paris",
            address="123 Rue de la Paix, 75001 Paris",
            country="France"
        )
        db.add(sender)
        
        # 3. Traveler user
        traveler = User(
            id=str(uuid.uuid4()),
            email="traveler@example.com",
            phone="+33600000003",
            hashed_password=pwd_context.hash("traveler123"),
            first_name="Marie",
            last_name="Martin",
            user_type=UserRole.TRAVELER,
            is_phone_verified=True,
            verification_status=VerificationStatus.VERIFIED,
            residence_city="Paris",
            country="France"
        )
        db.add(traveler)
        
        # 4. Relay Point user
        relay_user = User(
            id=str(uuid.uuid4()),
            email="relay@example.com",
            phone="+33600000004",
            hashed_password=pwd_context.hash("relay123"),
            first_name="Pierre",
            last_name="Relay",
            user_type=UserRole.RELAY_POINT,
            is_phone_verified=True,
            verification_status=VerificationStatus.VERIFIED,
            residence_city="Paris",
            country="France"
        )
        db.add(relay_user)
        
        db.commit()
        
        # Create relay point
        print("  Creating sample relay point...")
        relay_point = RelayPoint(
            id=str(uuid.uuid4()),
            user_id=relay_user.id,
            location_name="Point Relais Paris Centre",
            address="456 Boulevard Saint-Germain, 75006 Paris",
            city="Paris",
            country="France",
            postal_code="75006",
            latitude=48.8534,
            longitude=2.3488,
            phone="+33600000004",
            email="relay@example.com",
            operating_hours='{"monday": "9:00-18:00", "tuesday": "9:00-18:00"}',
            is_verified=True,
            is_active=True
        )
        db.add(relay_point)
        
        # Create trip
        print("  Creating sample trip...")
        trip = Trip(
            id=str(uuid.uuid4()),
            traveler_id=traveler.id,
            departure_city="Paris",
            departure_date=datetime.now().date() + timedelta(days=7),
            departure_country="France",
            destination_city="Casablanca",
            destination_country="Morocco",
            arrival_date=datetime.now().date() + timedelta(days=7),
            airline="Air France",
            flight_number="AF1234",
            spots_available=3,
            spots_taken=0,
            price_per_document=25,
            is_active=True
        )
        db.add(trip)
        
        db.commit()
        
        print("✅ Sample data created successfully")
        print("\n📧 Sample Login Credentials:")
        print("   Admin:    admin@docurgent.com / admin123")
        print("   Sender:   sender@example.com / sender123")
        print("   Traveler: traveler@example.com / traveler123")
        print("   Relay:    relay@example.com / relay123")
        
        return True
        
    except SQLAlchemyError as e:
        print(f"❌ Failed to create sample data: {str(e)}")
        db.rollback()
        return False
    finally:
        db.close()


def main():
    """Main initialization function"""
    print_banner()
    
    # Step 1: Check database connection
    if not check_database_connection():
        sys.exit(1)
    
    # Step 2: Check existing tables
    existing_tables = get_existing_tables()
    if existing_tables:
        print(f"\n⚠️  Found {len(existing_tables)} existing tables in database")
        print("Existing tables:", ", ".join(existing_tables))
        
        response = input("\nDo you want to DROP all existing tables and recreate? (yes/no): ")
        if response.lower() in ['yes', 'y']:
            if not drop_all_tables():
                sys.exit(1)
        else:
            print("❌ Initialization cancelled by user")
            sys.exit(0)
    
    # Step 3: Create all tables
    if not create_all_tables():
        sys.exit(1)
    
    # Step 4: Verify tables
    if not verify_tables():
        print("\n❌ Some tables are missing. Database initialization incomplete.")
        sys.exit(1)
    
    # Step 5: Show table details
    show_table_details()
    
    # Step 6: Create sample data (optional)
    print("\n" + "=" * 70)
    response = input("\nDo you want to create sample data for testing? (yes/no): ")
    if response.lower() in ['yes', 'y']:
        create_sample_data()
    
    # Success message
    print("\n" + "=" * 70)
    print("✅ Database initialization completed successfully!")
    print("=" * 70)
    print("\n🚀 Next Steps:")
    print("  1. Start the backend server:")
    print("     .venv\\Scripts\\activate && python -m uvicorn app.main:app --reload")
    print("  2. Visit API documentation:")
    print("     http://localhost:8000/docs")
    print("  3. Test the health endpoint:")
    print("     http://localhost:8000/health")
    print()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n❌ Initialization cancelled by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n\n❌ Unexpected error: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
