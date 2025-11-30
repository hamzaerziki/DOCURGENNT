# Database Management Scripts

This folder contains utility scripts for managing the DocUrgent database.

## Available Scripts

### 1. `init_database.py` - Initialize Database
Creates all database tables and optionally adds sample data.

```powershell
python init_database.py
```

**What it does:**
- Creates all 11 database tables
- Sets up foreign key relationships
- Creates indexes
- Optionally creates sample test data

---

### 2. `clear_sample_data.py` - Clear All Data
Removes all data from the database while keeping tables intact.

```powershell
python clear_sample_data.py
```

**What it does:**
- Deletes all records from all tables
- Preserves table structure
- Handles foreign key constraints properly
- Shows confirmation before deletion

**Use when:**
- You want to start fresh with production data
- Need to remove test/sample data
- Preparing for production deployment

---

### 3. `check_database.py` - View Database Contents
Quick view of current database status and contents.

```powershell
python check_database.py
```

**What it does:**
- Shows all users in the database
- Displays record counts for all tables
- Helps verify user creation
- Useful for debugging

---

## Common Workflows

### Fresh Start (Remove All Sample Data)
```powershell
# 1. Clear all data
python clear_sample_data.py
# Answer 'yes' when prompted

# 2. Verify database is empty
python check_database.py

# 3. Start creating real users via API
```

### Complete Reset (Recreate Everything)
```powershell
# 1. Drop and recreate database
$env:PGPASSWORD='Admin'
psql -U postgres -h localhost -p 5432 -c "DROP DATABASE docurgent;"
psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE docurgent;"

# 2. Initialize tables
python init_database.py
# Answer 'no' to sample data

# 3. Verify
python check_database.py
```

### Check User Creation
```powershell
# After creating a user via API, verify it was saved:
python check_database.py
```

---

## Troubleshooting

### "User created but not in database"

**Possible causes:**
1. **Database connection issue** - Check `.env` file has correct `DATABASE_URL`
2. **Transaction not committed** - Check API code commits the transaction
3. **Error during creation** - Check backend logs for errors
4. **Wrong database** - Verify you're checking the correct database

**How to debug:**
```powershell
# 1. Check database connection
python check_database.py

# 2. Check backend logs
# Look at the terminal running: python -m uvicorn app.main:app --reload

# 3. Try creating user directly in database
$env:PGPASSWORD='Admin'
psql -U postgres -h localhost -p 5432 -d docurgent
# Then: INSERT INTO users (...) VALUES (...);

# 4. Check if API endpoint is working
# Visit: http://localhost:8000/docs
# Try the POST /api/v1/auth/register endpoint
```

---

## Database Credentials

**Local PostgreSQL:**
- Username: `postgres`
- Password: `Admin`
- Host: `localhost`
- Port: `5432`
- Database: `docurgent`

**Connection String:**
```
postgresql://postgres:Admin@localhost:5432/docurgent
```

---

## Quick Reference

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `init_database.py` | Create tables | First setup, after database drop |
| `clear_sample_data.py` | Remove all data | Start fresh, remove test data |
| `check_database.py` | View contents | Verify users, debug issues |

---

**Last Updated:** 2025-11-30
