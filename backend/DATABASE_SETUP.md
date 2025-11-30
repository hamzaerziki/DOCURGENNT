# DocUrgent Database Setup Guide

## 🚀 Quick Start

This guide will help you set up the DocUrgent database from scratch.

---

## Prerequisites

Before running the database initialization script, ensure you have:

1. ✅ **PostgreSQL 15+** installed and running
2. ✅ **Python 3.11+** installed
3. ✅ **Virtual environment** activated
4. ✅ **Dependencies** installed from `requirements.txt`
5. ✅ **`.env` file** configured with correct `DATABASE_URL`

---

## Step-by-Step Setup

### Step 1: Start PostgreSQL

**Windows (using Docker):**
```powershell
docker-compose up -d postgres
```

**Or manually:**
```powershell
# PostgreSQL should be running on localhost:5432
```

### Step 2: Activate Virtual Environment

```powershell
cd backend
.venv\Scripts\activate
```

### Step 3: Verify Environment Configuration

Check your `.env` file has the correct database URL:
```
DATABASE_URL=postgresql://docurgent:docurgent123@localhost:5432/docurgent_db
```

### Step 4: Run Database Initialization Script

```powershell
python init_database.py
```

---

## What the Script Does

The `init_database.py` script will:

1. **Check Database Connection** ✅
   - Verifies PostgreSQL is accessible
   - Shows PostgreSQL version

2. **Check Existing Tables** 🔍
   - Lists any existing tables
   - Asks if you want to drop and recreate (if tables exist)

3. **Create All Tables** 🏗️
   - Creates 11 core tables:
     - `users` - User authentication and profiles
     - `trips` - Traveler journey information
     - `relay_points` - Physical handoff locations
     - `document_requests` - Core shipment tracking
     - `delivery_steps` - Shipment progress tracking
     - `otp_verifications` - Phone number verification
     - `kyc_documents` - Identity verification
     - `payments` - Escrow & transaction management
     - `conversations` - Chat between users
     - `messages` - Chat messages
     - `security_logs` - Audit trail

4. **Verify Tables** ✅
   - Confirms all tables were created
   - Shows checkmarks for each table

5. **Show Table Details** 📊
   - Displays column counts
   - Shows foreign key relationships
   - Lists indexes

6. **Create Sample Data** (Optional) 📝
   - Creates 4 test users (admin, sender, traveler, relay point)
   - Creates 1 relay point
   - Creates 1 trip
   - Provides login credentials

---

## Sample Output

```
======================================================================
  DocUrgent Database Initialization
======================================================================

🔍 Checking database connection...
✅ Connected to PostgreSQL: PostgreSQL 15.3 on x86_64-pc-linux-gnu...

🏗️  Creating database tables...
✅ All tables created successfully

🔍 Verifying created tables...

📊 Expected tables: 11
📊 Created tables: 11

  ✅ users
  ✅ trips
  ✅ relay_points
  ✅ document_requests
  ✅ delivery_steps
  ✅ otp_verifications
  ✅ kyc_documents
  ✅ payments
  ✅ conversations
  ✅ messages
  ✅ security_logs

📋 Table Details:
----------------------------------------------------------------------

🗂️  CONVERSATIONS
   Columns: 6
   Foreign Keys: 3
   Indexes: 0
   Primary Key: id
   Foreign Keys:
     - document_request_id → document_requests(id)
     - participant_1_id → users(id)
     - participant_2_id → users(id)

... (details for all tables)

======================================================================
Do you want to create sample data for testing? (yes/no): yes

📝 Creating sample data...
  Creating sample users...
  Creating sample relay point...
  Creating sample trip...
✅ Sample data created successfully

📧 Sample Login Credentials:
   Admin:    admin@docurgent.com / admin123
   Sender:   sender@example.com / sender123
   Traveler: traveler@example.com / traveler123
   Relay:    relay@example.com / relay123

======================================================================
✅ Database initialization completed successfully!
======================================================================

🚀 Next Steps:
  1. Start the backend server:
     .venv\Scripts\activate && python -m uvicorn app.main:app --reload
  2. Visit API documentation:
     http://localhost:8000/docs
  3. Test the health endpoint:
     http://localhost:8000/health
```

---

## Database Schema Overview

### Core Relationships

```
users (1) ──────< (N) document_requests
users (1) ──────< (N) trips
users (1) ────── (1) relay_points

document_requests (1) ──────< (N) delivery_steps
document_requests (1) ──────< (N) payments
document_requests (1) ────── (1) conversations

trips (1) ──────< (N) document_requests
relay_points (1) ──────< (N) document_requests

conversations (1) ──────< (N) messages
```

### Key Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| **users** | Authentication & profiles | phone, email, user_type, verification_status |
| **document_requests** | Shipment tracking | unique_code, delivery_code, status |
| **trips** | Traveler journeys | departure_city, destination_city, spots_available |
| **relay_points** | Physical locations | location_name, city, is_verified |
| **delivery_steps** | Progress tracking | step_id, completed, completed_at |
| **payments** | Escrow system | amount_cents, status, is_escrowed |

---

## Troubleshooting

### Error: "Database connection failed"

**Solution:**
1. Ensure PostgreSQL is running:
   ```powershell
   docker-compose ps
   ```
2. Check DATABASE_URL in `.env` file
3. Verify database credentials

### Error: "Permission denied"

**Solution:**
1. Ensure you have write permissions to the database
2. Check PostgreSQL user has CREATE TABLE privileges

### Error: "Module not found"

**Solution:**
1. Activate virtual environment:
   ```powershell
   .venv\Scripts\activate
   ```
2. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

### Want to Reset Database?

Run the script again and answer "yes" when asked to drop existing tables:
```powershell
python init_database.py
# Answer "yes" when prompted to drop tables
```

---

## Using Alembic Migrations (Alternative)

For production environments, use Alembic migrations instead:

```powershell
# Create initial migration
alembic revision --autogenerate -m "Initial database schema"

# Apply migration
alembic upgrade head

# View migration history
alembic history
```

---

## Next Steps After Database Setup

1. **Start Backend Server:**
   ```powershell
   .venv\Scripts\activate
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Test API Endpoints:**
   - Visit: http://localhost:8000/docs
   - Try the `/health` endpoint
   - Login with sample credentials

3. **Test Authentication:**
   ```bash
   # Register a new user
   POST http://localhost:8000/api/v1/auth/register
   
   # Login
   POST http://localhost:8000/api/v1/auth/login
   ```

4. **Explore Database:**
   ```powershell
   # Connect to PostgreSQL
   psql -U docurgent -d docurgent_db
   
   # List tables
   \dt
   
   # View users
   SELECT * FROM users;
   ```

---

## Database Maintenance

### Backup Database
```powershell
pg_dump -U docurgent docurgent_db > backup.sql
```

### Restore Database
```powershell
psql -U docurgent docurgent_db < backup.sql
```

### Check Database Size
```sql
SELECT pg_size_pretty(pg_database_size('docurgent_db'));
```

---

## Support

If you encounter any issues:
1. Check the [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed schema information
2. Review the [README.md](./README.md) for general setup instructions
3. Check PostgreSQL logs for detailed error messages

---

**Last Updated:** 2025-11-30  
**Version:** 1.0
