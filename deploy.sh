#!/bin/bash

echo "🚀 Starting deployment to Fly.io..."

# Check if flyctl is installed
if ! command -v flyctl &> /dev/null; then
    echo "❌ flyctl is not installed. Please install it first:"
    echo "   Visit: https://fly.io/docs/getting-started/installing-flyctl/"
    exit 1
fi

# Check if user is logged in
if ! flyctl auth whoami &> /dev/null; then
    echo "❌ You're not logged in to Fly.io. Please run:"
    echo "   flyctl auth login"
    exit 1
fi

# Check if MONGODB_URI secret is set
echo "🔍 Checking if MONGODB_URI secret is configured..."
if ! flyctl secrets list | grep -q "MONGODB_URI"; then
    echo "⚠️  MONGODB_URI secret is not set!"
    echo "   Please set it with:"
    echo "   flyctl secrets set MONGODB_URI=\"mongodb://your-host:27017/tensillabs-lite\""
    echo ""
    read -p "Do you want to continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ MONGODB_URI secret is configured"
fi

echo "📦 Building and deploying application..."
flyctl deploy

echo "✅ Deployment complete!"
echo "🌐 Your app should be available at: https://tensillabs-lite.fly.dev"
echo "🏥 Health check: https://tensillabs-lite.fly.dev/api/v1/health"
echo ""
echo "Useful commands:"
echo "  flyctl logs           - View application logs"
echo "  flyctl status         - Check application status"
echo "  flyctl ssh console    - SSH into your application"
echo "  flyctl scale count 1  - Scale to 1 machine"
