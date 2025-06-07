@echo off

echo 🚀 Starting deployment to Fly.io...

REM Check if flyctl is installed
flyctl version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ flyctl is not installed. Please install it first:
    echo    Visit: https://fly.io/docs/getting-started/installing-flyctl/
    exit /b 1
)

REM Check if user is logged in
flyctl auth whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ You're not logged in to Fly.io. Please run:
    echo    flyctl auth login
    exit /b 1
)

REM Check if MONGODB_URI secret is set
echo 🔍 Checking if MONGODB_URI secret is configured...
flyctl secrets list | findstr "MONGODB_URI" >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  MONGODB_URI secret is not set!
    echo    Please set it with:
    echo    flyctl secrets set MONGODB_URI="mongodb://your-host:27017/tensillabs-lite"
    echo.
    set /p continue="Do you want to continue anyway? (y/N): "
    if /i not "%continue%"=="y" exit /b 1
) else (
    echo ✅ MONGODB_URI secret is configured
)

echo 📦 Building and deploying application...
flyctl deploy

echo ✅ Deployment complete!
echo 🌐 Your app should be available at: https://tensillabs-lite.fly.dev
echo 🏥 Health check: https://tensillabs-lite.fly.dev/api/v1/health
echo.
echo Useful commands:
echo   flyctl logs           - View application logs
echo   flyctl status         - Check application status
echo   flyctl ssh console    - SSH into your application
echo   flyctl scale count 1  - Scale to 1 machine
