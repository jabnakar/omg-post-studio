#!/bin/bash

# SSL Certificate Setup Script using Let's Encrypt
# Update DOMAIN_NAME before running

DOMAIN_NAME="your-domain.com"  # Update this with your actual domain

echo "🔒 Setting up SSL certificate for $DOMAIN_NAME..."

# Install Certbot if not already installed
if ! command -v certbot &> /dev/null; then
    echo "Installing Certbot..."
    sudo apt update
    sudo apt install -y certbot python3-certbot-nginx
fi

# Stop nginx temporarily to avoid conflicts
docker-compose -f docker-compose.yml stop nginx

# Generate SSL certificate
sudo certbot certonly --standalone -d $DOMAIN_NAME -d www.$DOMAIN_NAME

# Create SSL directory and copy certificates
sudo mkdir -p ./ssl
sudo cp /etc/letsencrypt/live/$DOMAIN_NAME/fullchain.pem ./ssl/cert.pem
sudo cp /etc/letsencrypt/live/$DOMAIN_NAME/privkey.pem ./ssl/key.pem
sudo chown -R $USER:$USER ./ssl

# Update nginx.conf with your domain
sed -i "s/your-domain.com/$DOMAIN_NAME/g" nginx.conf

# Restart services
docker-compose -f docker-compose.yml up -d

echo "✅ SSL setup complete!"
echo "Your site should now be accessible at https://$DOMAIN_NAME"

# Set up auto-renewal
echo "📅 Setting up auto-renewal..."
echo "0 12 * * * /usr/bin/certbot renew --quiet && docker-compose -f $PWD/docker-compose.yml restart nginx" | sudo crontab -
