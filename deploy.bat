@echo off

echo 🚀 Starting deployment to Fly.io...

flyctl version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ flyctl is not installed. Please install it first:
    echo    Visit: https://fly.io/docs/getting-started/installing-flyctl/
    exit /b 1
)

flyctl auth whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ You're not logged in to Fly.io. Please run:
    echo    flyctl auth login
    exit /b 1
)

echo 📦 Building and deploying application...
flyctl deploy

echo ✅ Deployment complete!
echo 🌐 Your app should be available at: https://tensillabs-lite.fly.dev
echo.
echo Useful commands:
echo   flyctl logs           - View application logs
echo   flyctl status         - Check application status
echo   flyctl ssh console    - SSH into your application
echo   flyctl scale count 1  - Scale to 1 machine
