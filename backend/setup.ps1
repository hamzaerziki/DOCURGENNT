# ============================================================================
# DocUrgent Backend - Automated Setup Script for Windows
# ============================================================================
# This script automates the complete setup of the DocUrgent backend
# Run with: .\setup.ps1
# ============================================================================

Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "  DocUrgent Backend - Automated Setup" -ForegroundColor Cyan
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host ""

# ============================================================================
# Step 1: Check Prerequisites
# ============================================================================
Write-Host "Step 1: Checking Prerequisites..." -ForegroundColor Yellow
Write-Host ""

# Check Python
Write-Host "  Checking Python installation..." -NoNewline
try {
    $pythonVersion = python --version 2>&1
    if ($pythonVersion -match "Python 3\.(1[1-9]|[2-9]\d)") {
        Write-Host " OK ($pythonVersion)" -ForegroundColor Green
    } else {
        Write-Host " WARNING: Python 3.11+ recommended (found $pythonVersion)" -ForegroundColor Yellow
    }
} catch {
    Write-Host " ERROR: Python not found!" -ForegroundColor Red
    Write-Host "  Please install Python 3.11+ from https://www.python.org/downloads/" -ForegroundColor Red
    exit 1
}

# Check PostgreSQL
Write-Host "  Checking PostgreSQL connection..." -NoNewline
try {
    $env:PGPASSWORD = "Admin"
    $pgTest = psql -U postgres -h localhost -p 5432 -c "SELECT version();" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host " OK" -ForegroundColor Green
    } else {
        Write-Host " WARNING: Cannot connect to PostgreSQL" -ForegroundColor Yellow
        Write-Host "    Make sure PostgreSQL is running with credentials: postgres/Admin" -ForegroundColor Yellow
    }
} catch {
    Write-Host " WARNING: psql command not found" -ForegroundColor Yellow
    Write-Host "    PostgreSQL client tools not in PATH" -ForegroundColor Yellow
}

# Check pip
Write-Host "  Checking pip..." -NoNewline
try {
    $pipVersion = python -m pip --version 2>&1
    Write-Host " OK" -ForegroundColor Green
} catch {
    Write-Host " ERROR: pip not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# ============================================================================
# Step 2: Create Virtual Environment
# ============================================================================
Write-Host "Step 2: Setting up Python Virtual Environment..." -ForegroundColor Yellow
Write-Host ""

if (Test-Path ".venv") {
    Write-Host "  Virtual environment already exists. Removing old one..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force .venv
}

Write-Host "  Creating virtual environment..." -NoNewline
python -m venv .venv
if ($LASTEXITCODE -eq 0) {
    Write-Host " OK" -ForegroundColor Green
} else {
    Write-Host " ERROR" -ForegroundColor Red
    exit 1
}

Write-Host ""

# ============================================================================
# Step 3: Install Dependencies
# ============================================================================
Write-Host "Step 3: Installing Python Dependencies..." -ForegroundColor Yellow
Write-Host ""
Write-Host "  This may take a few minutes..." -ForegroundColor Cyan
Write-Host ""

& .venv\Scripts\python.exe -m pip install --upgrade pip
& .venv\Scripts\pip.exe install -r requirements.txt

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "  Dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "  ERROR: Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host ""

# ============================================================================
# Step 4: Create Database
# ============================================================================
Write-Host "Step 4: Creating PostgreSQL Database..." -ForegroundColor Yellow
Write-Host ""

$env:PGPASSWORD = "Admin"
Write-Host "  Checking if 'docurgent' database exists..." -NoNewline

$dbExists = psql -U postgres -h localhost -p 5432 -lqt 2>&1 | Select-String -Pattern "docurgent"

if ($dbExists) {
    Write-Host " EXISTS" -ForegroundColor Yellow
    $response = Read-Host "  Database 'docurgent' already exists. Drop and recreate? (yes/no)"
    if ($response -eq "yes" -or $response -eq "y") {
        Write-Host "  Dropping existing database..." -NoNewline
        psql -U postgres -h localhost -p 5432 -c "DROP DATABASE IF EXISTS docurgent;" 2>&1 | Out-Null
        Write-Host " OK" -ForegroundColor Green
        
        Write-Host "  Creating new database..." -NoNewline
        psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE docurgent;" 2>&1 | Out-Null
        Write-Host " OK" -ForegroundColor Green
    }
} else {
    Write-Host " NOT FOUND" -ForegroundColor Yellow
    Write-Host "  Creating database..." -NoNewline
    psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE docurgent;" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host " OK" -ForegroundColor Green
    } else {
        Write-Host " ERROR" -ForegroundColor Red
        Write-Host "  Please create the database manually:" -ForegroundColor Yellow
        Write-Host "    psql -U postgres -c 'CREATE DATABASE docurgent;'" -ForegroundColor Yellow
    }
}

Write-Host ""

# ============================================================================
# Step 5: Initialize Database Tables
# ============================================================================
Write-Host "Step 5: Initializing Database Tables..." -ForegroundColor Yellow
Write-Host ""

$response = Read-Host "  Do you want to initialize database tables now? (yes/no)"
if ($response -eq "yes" -or $response -eq "y") {
    Write-Host ""
    & .venv\Scripts\python.exe init_database.py
    Write-Host ""
}

# ============================================================================
# Step 6: Summary
# ============================================================================
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  1. Activate virtual environment:" -ForegroundColor White
Write-Host "     .venv\Scripts\activate" -ForegroundColor Cyan
Write-Host ""
Write-Host "  2. Start the backend server:" -ForegroundColor White
Write-Host "     python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "  3. Visit API documentation:" -ForegroundColor White
Write-Host "     http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "  4. Test health endpoint:" -ForegroundColor White
Write-Host "     http://localhost:8000/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host ""

# Keep window open
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
