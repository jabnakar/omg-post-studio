#!/bin/bash

# Deployment script for Hostinger VPS
# Run this script to deploy your application

set -e

APP_DIR="/var/www/omg-post-studio"
REPO_URL="https://github.com/yourusername/omg-post-studio.git"  # Update with your repo

echo "🚀 Starting deployment..."

# Navigate to app directory
cd $APP_DIR

# Pull latest changes (if using git)
if [ -d ".git" ]; then
    echo "📥 Pulling latest changes..."
    git pull origin main
else
    echo "📥 Cloning repository..."
    git clone $REPO_URL .
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "Please create .env file with your configuration."
    echo "See deployment/env.example for reference."
    exit 1
fi

# Build and start services
echo "🏗️  Building and starting services..."
docker-compose -f deployment/docker-compose.yml down
docker-compose -f deployment/docker-compose.yml build --no-cache
docker-compose -f deployment/docker-compose.yml up -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 30

# Check if services are running
if docker-compose -f deployment/docker-compose.yml ps | grep -q "Up"; then
    echo "✅ Deployment successful!"
    echo "Your application is now running at:"
    echo "- HTTP: http://$(curl -s ifconfig.me)"
    echo "- HTTPS: https://your-domain.com (if SSL is configured)"
else
    echo "❌ Deployment failed!"
    echo "Check logs with: docker-compose -f deployment/docker-compose.yml logs"
    exit 1
fi

echo ""
echo "📋 Useful commands:"
echo "- View logs: docker-compose -f deployment/docker-compose.yml logs -f"
echo "- Stop services: docker-compose -f deployment/docker-compose.yml down"
echo "- Restart services: docker-compose -f deployment/docker-compose.yml restart"
echo "- Update SSL: sudo certbot --nginx -d your-domain.com"
