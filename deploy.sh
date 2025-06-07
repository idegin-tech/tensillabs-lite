#!/bin/bash

# Deployment script for Fly.io
# This script helps automate the deployment process

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

# Build and deploy
echo "📦 Building and deploying application..."
flyctl deploy

echo "✅ Deployment complete!"
echo "🌐 Your app should be available at: https://tensillabs-lite.fly.dev"
echo ""
echo "Useful commands:"
echo "  flyctl logs           - View application logs"
echo "  flyctl status         - Check application status"
echo "  flyctl ssh console    - SSH into your application"
echo "  flyctl scale count 1  - Scale to 1 machine"
