# DocUrgent Backend - Quick Setup Guide

## 🚀 One-Command Setup

For the fastest setup experience, simply run:

```powershell
.\setup.ps1
```

This automated script will:
- ✅ Check all prerequisites (Python, PostgreSQL, pip)
- ✅ Create virtual environment
- ✅ Install all dependencies
- ✅ Create PostgreSQL database
- ✅ Initialize all database tables
- ✅ Optionally create sample test data

---

## 📋 Prerequisites

Before running the setup, ensure you have:

1. **Python 3.11+** installed
   - Download from: https://www.python.org/downloads/
   - Verify: `python --version`

2. **PostgreSQL** installed and running
   - **Username**: `postgres`
   - **Password**: `Admin`
   - **Host**: `localhost`
   - **Port**: `5432`
   - Verify: `psql -U postgres -h localhost -p 5432 -c "SELECT version();"`

3. **Git** (optional, for cloning)
   - Download from: https://git-scm.com/downloads/

---

## 🛠️ Manual Setup (Alternative)

If you prefer manual setup or the automated script fails:

### Step 1: Create Virtual Environment

```powershell
cd backend
python -m venv .venv
```

### Step 2: Activate Virtual Environment

```powershell
.venv\Scripts\activate
```

### Step 3: Install Dependencies

```powershell
pip install -r requirements.txt
```

This will install all required packages:
- **FastAPI** - Web framework
- **SQLAlchemy** - Database ORM
- **PostgreSQL** - Database driver
- **Redis** - Caching
- **Celery** - Background tasks
- **Stripe** - Payments
- **Twilio** - SMS/OTP
- **And more...** (see requirements.txt for full list)

### Step 4: Create Database

```powershell
$env:PGPASSWORD='Admin'
psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE docurgent;"
```

### Step 5: Initialize Database Tables

```powershell
python init_database.py
```

Answer the prompts:
- **Create sample data?** → `yes` (recommended for testing)

---

## 📊 What Gets Installed

### Python Dependencies (from requirements.txt)

| Category | Packages |
|----------|----------|
| **Core Framework** | FastAPI, Uvicorn, Gunicorn |
| **Database** | SQLAlchemy, Alembic, psycopg2-binary |
| **Authentication** | python-jose, passlib, PyJWT |
| **Validation** | Pydantic, email-validator |
| **Caching** | Redis, hiredis |
| **Background Tasks** | Celery, Flower |
| **Storage** | MinIO |
| **Communication** | aiosmtplib, Twilio |
| **Payments** | Stripe |
| **QR Codes** | qrcode, Pillow |
| **Real-time** | websockets, python-socketio |
| **Testing** | pytest, pytest-asyncio, httpx |
| **Development** | black, flake8, mypy |

### Database Tables (11 total)

1. **users** - User authentication and profiles
2. **trips** - Traveler journey information
3. **relay_points** - Physical handoff locations
4. **document_requests** - Core shipment tracking
5. **delivery_steps** - Shipment progress tracking
6. **otp_verifications** - Phone number verification
7. **kyc_documents** - Identity verification
8. **payments** - Escrow & transaction management
9. **conversations** - Chat between users
10. **messages** - Chat messages
11. **security_logs** - Audit trail

---

## 🎯 After Setup

### Start the Backend Server

```powershell
# Activate virtual environment (if not already activated)
.venv\Scripts\activate

# Start server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Or use the command from your configuration:

```powershell
.venv\Scripts\activate && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Access the API

- **API Documentation**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

### Test with Sample Credentials

If you created sample data during initialization, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@docurgent.com | admin123 |
| **Sender** | sender@example.com | sender123 |
| **Traveler** | traveler@example.com | traveler123 |
| **Relay Point** | relay@example.com | relay123 |

---

## 🔧 Configuration

### Environment Variables (.env)

The `.env` file contains all configuration:

```env
# Database
DATABASE_URL=postgresql://postgres:Admin@localhost:5432/docurgent

# JWT
SECRET_KEY=your-secret-key-change-this-in-production-min-32-chars-docurgent-2024

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

**Important**: Change the `SECRET_KEY` in production!

---

## 📝 Common Commands

### Database Management

```powershell
# Connect to database
$env:PGPASSWORD='Admin'
psql -U postgres -h localhost -p 5432 -d docurgent

# List tables
\dt

# View users
SELECT * FROM users;

# Drop database (careful!)
DROP DATABASE docurgent;

# Recreate database
CREATE DATABASE docurgent;
```

### Alembic Migrations (Production)

```powershell
# Create migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1

# View history
alembic history
```

### Testing

```powershell
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test
pytest tests/test_auth.py -v
```

### Code Quality

```powershell
# Format code
black app/

# Lint code
flake8 app/

# Type checking
mypy app/
```

---

## 🐛 Troubleshooting

### Issue: "Python not found"

**Solution**: Install Python 3.11+ from https://www.python.org/downloads/

### Issue: "Cannot connect to PostgreSQL"

**Solution**: 
1. Ensure PostgreSQL is running
2. Check credentials: `postgres` / `Admin`
3. Test connection: `psql -U postgres -h localhost -p 5432`

### Issue: "Database 'docurgent' does not exist"

**Solution**:
```powershell
$env:PGPASSWORD='Admin'
psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE docurgent;"
```

### Issue: "Module not found" errors

**Solution**:
```powershell
# Activate virtual environment
.venv\Scripts\activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue: "Port 8000 already in use"

**Solution**:
```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID)
taskkill /PID <PID> /F

# Or use a different port
python -m uvicorn app.main:app --reload --port 8001
```

---

## 📚 Additional Resources

- **Architecture Documentation**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Database Setup Guide**: [DATABASE_SETUP.md](./DATABASE_SETUP.md)
- **API Documentation**: http://localhost:8000/docs (after starting server)
- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **SQLAlchemy Docs**: https://docs.sqlalchemy.org/

---

## 🆘 Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed setup instructions
3. Check [ARCHITECTURE.md](./ARCHITECTURE.md) for system design details
4. Review PostgreSQL logs for database errors
5. Check Python error messages for dependency issues

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Virtual environment created (`.venv` folder exists)
- [ ] All dependencies installed (no errors from `pip install`)
- [ ] PostgreSQL database `docurgent` created
- [ ] All 11 tables created in database
- [ ] Sample data created (optional)
- [ ] Backend server starts without errors
- [ ] Can access http://localhost:8000/docs
- [ ] Health endpoint returns success: http://localhost:8000/health

---

**Last Updated**: 2025-11-30  
**Version**: 1.0  
**Status**: Production Ready
