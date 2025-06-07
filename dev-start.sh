#!/bin/bash

# Development start script for TensilLabs Lite

echo "Starting TensilLabs Lite development environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

# Copy .env.example to .env if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "Please review and update the .env file with your configuration."
fi

# Start MongoDB with Docker Compose
echo "Starting MongoDB..."
docker-compose up -d mongodb

# Wait for MongoDB to be ready
echo "Waiting for MongoDB to be ready..."
for i in {1..30}; do
    if docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
        echo "MongoDB is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "Error: MongoDB failed to start within 30 seconds"
        exit 1
    fi
    sleep 1
done

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the application in development mode
echo "Starting the application..."
npm run dev
