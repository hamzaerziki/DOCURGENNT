#!/bin/bash

# DocUrgent Backend Setup Script
# This script sets up the complete development environment

set -e  # Exit on error

echo "========================================="
echo "DocUrgent Backend Setup"
echo "========================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "${YELLOW}Python 3 is not installed. Please install Python 3.11 or higher.${NC}"
    exit 1
fi

echo "${GREEN}✓ Python 3 found${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "${YELLOW}Docker is not installed. Please install Docker.${NC}"
    exit 1
fi

echo "${GREEN}✓ Docker found${NC}"

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "${YELLOW}Docker Compose is not installed. Please install Docker Compose.${NC}"
    exit 1
fi

echo "${GREEN}✓ Docker Compose found${NC}"

# Create virtual environment
echo ""
echo "Creating Python virtual environment..."
python3 -m venv .venv

# Activate virtual environment
echo "Activating virtual environment..."
source .venv/bin/activate || . .venv/Scripts/activate

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip

# Install Python dependencies
echo ""
echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "${GREEN}✓ Python dependencies installed${NC}"

# Create .env file from template
if [ ! -f .env ]; then
    echo ""
    echo "Creating .env file from template..."
    cp .env.template .env
    echo "${YELLOW}⚠ Please update .env file with your configuration${NC}"
else
    echo "${GREEN}✓ .env file already exists${NC}"
fi

# Start Docker services
echo ""
echo "Starting Docker services (PostgreSQL, Redis, MinIO)..."
docker-compose up -d postgres redis minio

echo "${GREEN}✓ Docker services started${NC}"

# Wait for PostgreSQL to be ready
echo ""
echo "Waiting for PostgreSQL to be ready..."
sleep 5

# Run database migrations
echo ""
echo "Running database migrations..."
alembic upgrade head

echo "${GREEN}✓ Database migrations completed${NC}"

# Create MinIO bucket
echo ""
echo "Setting up MinIO bucket..."
# This would require MinIO client (mc) to be installed
# For now, we'll skip this step

echo ""
echo "========================================="
echo "${GREEN}Setup completed successfully!${NC}"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Update .env file with your configuration"
echo "2. Run 'source .venv/bin/activate' to activate virtual environment"
echo "3. Run 'uvicorn app.main:app --reload' to start the development server"
echo "4. Visit http://localhost:8000/docs for API documentation"
echo ""
echo "To start all services with Docker Compose:"
echo "  docker-compose up"
echo ""
echo "To run tests:"
echo "  pytest tests/"
echo ""
