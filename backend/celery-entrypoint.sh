#!/bin/bash
set -e

echo "Waiting for Redis to be ready..."
until redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" ping 2>/dev/null; do
  echo "Redis is unavailable - sleeping"
  sleep 2
done

echo "Redis is up - starting Celery worker"

# Start Celery worker
exec celery -A app.workers.celery_app worker --loglevel=info
