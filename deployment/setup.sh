#!/bin/bash

# VPS Setup Script for Hostinger
# Run this script on your VPS after connecting via SSH

set -e

echo "🚀 Starting VPS setup for OMG Post Studio..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Docker
echo "🐳 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
echo "🔧 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Node.js (for development)
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/omg-post-studio
sudo chown -R $USER:$USER /var/www/omg-post-studio

# Install SSL tools (for Let's Encrypt)
echo "🔒 Installing SSL tools..."
sudo apt install -y certbot python3-certbot-nginx

# Create logs directory
sudo mkdir -p /var/log/omg-post-studio
sudo chown -R $USER:$USER /var/log/omg-post-studio

echo "✅ VPS setup complete!"
echo ""
echo "Next steps:"
echo "1. Upload your application code to /var/www/omg-post-studio"
echo "2. Configure your environment variables"
echo "3. Set up SSL certificates"
echo "4. Start the application with Docker Compose"
echo ""
echo "Don't forget to:"
echo "- Point your domain to this VPS IP address"
echo "- Configure your Supabase database"
echo "- Update nginx.conf with your domain name"
