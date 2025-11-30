# DocUrgent Backend

A production-ready, multi-tenant SaaS backend for school and education management built with FastAPI, PostgreSQL, Redis, and complete CI/CD pipeline.

## 🚀 Features

- **Multi-Tenancy**: Row-level tenancy with automatic tenant scoping
- **Authentication**: JWT-based auth with access/refresh tokens and RBAC
- **Database**: PostgreSQL with SQLAlchemy ORM and Alembic migrations
- **Caching**: Redis for caching and rate limiting
- **Storage**: MinIO/S3 compatible object storage
- **Background Tasks**: Celery for async task processing
- **API Documentation**: Auto-generated Swagger/ReDoc docs
- **CI/CD**: Jenkins pipeline with ArgoCD GitOps deployment
- **Containerization**: Docker and Docker Compose ready
- **Testing**: Comprehensive test suite with pytest

## 📋 Prerequisites

- Python 3.11+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+
- MinIO (optional, for file storage)

## 🛠️ Quick Start

### 1. Clone and Setup

```bash
cd backend
bash setup.sh
```

The setup script will:
- Create a Python virtual environment
- Install all dependencies
- Start Docker services (PostgreSQL, Redis, MinIO)
- Run database migrations
- Create `.env` file from template

### 2. Configure Environment

Edit `.env` file with your configuration:

```bash
# Update these values
SECRET_KEY=your-secret-key-min-32-chars
DATABASE_URL=postgresql://user:password@localhost:5432/docurgent_db
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### 3. Run Development Server

```bash
# Activate virtual environment
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Run server
uvicorn app.main:app --reload
```

Visit:
- API Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- Health Check: http://localhost:8000/health

## 🐳 Docker Deployment

### Development with Docker Compose

```bash
docker-compose up
```

This starts:
- PostgreSQL (port 5432)
- Redis (port 6379)
- MinIO (port 9000, console 9001)
- FastAPI Backend (port 8000)
- NGINX Reverse Proxy (port 80)
- Celery Worker

### Production Build

```bash
docker build -t docurgent-backend .
docker run -p 8000:8000 --env-file .env docurgent-backend
```

## 📊 Database Migrations

```bash
# Create a new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# View migration history
alembic history
```

## 🧪 Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_auth.py

# Run with verbose output
pytest -v
```

## 📁 Project Structure

```
backend/
├── app/
│   ├── api/v1/endpoints/    # API route handlers
│   ├── core/                # Core configuration
│   ├── database/            # Database setup
│   ├── models/              # SQLAlchemy models
│   ├── schemas/             # Pydantic schemas
│   ├── services/            # Business logic
│   ├── utils/               # Utility functions
│   ├── workers/             # Celery tasks
│   └── main.py              # FastAPI app
├── alembic/                 # Database migrations
├── k8s/                     # Kubernetes manifests
├── argocd/                  # ArgoCD config
├── tests/                   # Test suite
├── Dockerfile               # Docker image
├── docker-compose.yml       # Docker Compose config
├── Jenkinsfile              # CI/CD pipeline
└── requirements.txt         # Python dependencies
```

## 🔐 Authentication

### Register a User

```bash
POST /api/v1/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "role": "student",
  "tenant_id": 1
}
```

### Login

```bash
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

Returns:
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer"
}
```

### Use Token

```bash
curl -H "Authorization: Bearer <access_token>" \
  http://localhost:8000/api/v1/users/me
```

## 🎯 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password

### Tenants
- `POST /api/v1/tenants` - Create tenant
- `GET /api/v1/tenants` - List tenants
- `GET /api/v1/tenants/{id}` - Get tenant
- `PUT /api/v1/tenants/{id}` - Update tenant

### Users
- `GET /api/v1/users/me` - Get current user
- `GET /api/v1/users` - List users
- `POST /api/v1/users` - Create user
- `PUT /api/v1/users/{id}` - Update user
- `DELETE /api/v1/users/{id}` - Delete user

### Students
- `GET /api/v1/students` - List students
- `POST /api/v1/students` - Create student
- `GET /api/v1/students/{id}` - Get student
- `PUT /api/v1/students/{id}` - Update student
- `POST /api/v1/students/{id}/link-parent` - Link parent

### Analytics
- `GET /api/v1/analytics/student-progress/{id}` - Student progress
- `GET /api/v1/analytics/school-performance` - School metrics
- `GET /api/v1/analytics/teacher-activity/{id}` - Teacher activity
- `GET /api/v1/analytics/ai-recommendations` - AI recommendations

## 🚢 CI/CD Pipeline

### Jenkins

The Jenkinsfile defines a complete CI/CD pipeline:

1. **Checkout**: Clone repository
2. **Install Dependencies**: Setup Python environment
3. **Lint & Format**: Run flake8 and black
4. **Run Tests**: Execute pytest with coverage
5. **Build Docker**: Create Docker image
6. **Push to Registry**: Upload to container registry
7. **Update K8s**: Update Kubernetes manifests

### ArgoCD

ArgoCD automatically deploys changes to Kubernetes:

```bash
# Apply ArgoCD application
kubectl apply -f argocd/application.yaml

# Sync application
argocd app sync docurgent-backend
```

## ☸️ Kubernetes Deployment

```bash
# Create namespace
kubectl create namespace docurgent

# Apply manifests
kubectl apply -f k8s/

# Check deployment
kubectl get pods -n docurgent
kubectl get svc -n docurgent

# View logs
kubectl logs -f deployment/docurgent-backend -n docurgent
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `SECRET_KEY` | JWT secret key (min 32 chars) | Required |
| `REDIS_HOST` | Redis hostname | localhost |
| `REDIS_PORT` | Redis port | 6379 |
| `MINIO_ENDPOINT` | MinIO endpoint | localhost:9000 |
| `SMTP_HOST` | SMTP server | smtp.gmail.com |
| `CORS_ORIGINS` | Allowed origins | http://localhost:3000 |

## 📝 License

Proprietary - All rights reserved

## 👥 Support

For support, email support@docurgent.com or create an issue in the repository.
