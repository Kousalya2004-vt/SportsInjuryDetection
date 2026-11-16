#!/bin/bash
echo "============================================================"
echo "🏃 KINETIQ.AI PRODUCTION DOCKER DEPLOYMENT SCRIPT"
echo "============================================================"

# Check if Docker is installed
if ! command -v docker &> /dev/null
then
    echo "⚠️ Docker is not installed. Please install Docker to proceed with containerized deployment."
    exit 1
fi

echo "🐳 Building and launching containerized services via Docker Compose..."
docker-compose down
docker-compose up --build -d

echo "============================================================"
echo "✅ KinetIQ.AI Platform Successfully Deployed!"
echo "Frontend URL: http://localhost:3000"
echo "Backend API:  http://localhost:5000"
echo "Database:     MySQL (Port 3306)"
echo "============================================================"
