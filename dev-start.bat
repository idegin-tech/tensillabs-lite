@echo off

REM Development start script for TensilLabs Lite

echo Starting TensilLabs Lite development environment...

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo Error: Docker is not running. Please start Docker and try again.
    exit /b 1
)

REM Copy .env.example to .env if it doesn't exist
if not exist .env (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo Please review and update the .env file with your configuration.
)

REM Start MongoDB with Docker Compose
echo Starting MongoDB...
docker-compose up -d mongodb

REM Wait for MongoDB to be ready
echo Waiting for MongoDB to be ready...
for /l %%i in (1,1,30) do (
    docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')" >nul 2>&1
    if not errorlevel 1 (
        echo MongoDB is ready!
        goto :mongodb_ready
    )
    timeout /t 1 /nobreak >nul
)
echo Error: MongoDB failed to start within 30 seconds
exit /b 1

:mongodb_ready

REM Install dependencies if needed
if not exist node_modules (
    echo Installing dependencies...
    npm install
)

REM Start the application in development mode
echo Starting the application...
npm run dev
