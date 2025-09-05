# Deployment Guide: Hostinger VPS + Supabase

This guide will help you deploy the OMG Post Studio to your Hostinger VPS using Supabase as the database.

## Prerequisites

1. **Hostinger VPS** with Ubuntu/Debian
2. **Supabase Account** with a project created
3. **Domain name** pointed to your VPS IP
4. **SSH access** to your VPS

## Step 1: Supabase Setup

1. Go to [Supabase](https://supabase.com) and create a new project
2. Go to Settings > Database and copy your connection string
3. In the SQL Editor, run the migration files to create tables:
   - Copy contents from `backend/auth/migrations/1_create_users.up.sql`
   - Copy contents from `backend/posts/migrations/1_create_posts.up.sql`
4. Note down your:
   - Database URL (connection string)
   - Project URL
   - API Keys (anon and service_role)

## Step 2: VPS Initial Setup

1. **Connect to your VPS via SSH:**
   ```bash
   ssh root@your-vps-ip
   ```

2. **Run the setup script:**
   ```bash
   wget https://raw.githubusercontent.com/yourusername/omg-post-studio/main/deployment/setup.sh
   chmod +x setup.sh
   ./setup.sh
   ```

3. **Logout and login again** to apply Docker group permissions:
   ```bash
   exit
   ssh root@your-vps-ip
   ```

## Step 3: Application Deployment

1. **Navigate to the application directory:**
   ```bash
   cd /var/www/omg-post-studio
   ```

2. **Clone your repository:**
   ```bash
   git clone https://github.com/yourusername/omg-post-studio.git .
   ```

3. **Create environment file:**
   ```bash
   cp deployment/env.example .env
   nano .env
   ```

4. **Configure your .env file:**
   ```env
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
   JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
   NODE_ENV=production
   ```

5. **Update nginx configuration:**
   ```bash
   nano deployment/nginx.conf
   # Replace 'your-domain.com' with your actual domain
   ```

6. **Deploy the application:**
   ```bash
   chmod +x deployment/deploy.sh
   ./deployment/deploy.sh
   ```

## Step 4: SSL Certificate Setup

1. **Update the SSL setup script:**
   ```bash
   nano deployment/ssl-setup.sh
   # Update DOMAIN_NAME with your domain
   ```

2. **Run SSL setup:**
   ```bash
   chmod +x deployment/ssl-setup.sh
   ./deployment/ssl-setup.sh
   ```

## Step 5: Verification

1. **Check if services are running:**
   ```bash
   docker-compose -f deployment/docker-compose.yml ps
   ```

2. **View logs if needed:**
   ```bash
   docker-compose -f deployment/docker-compose.yml logs -f
   ```

3. **Test your application:**
   - HTTP: `http://your-domain.com`
   - HTTPS: `https://your-domain.com`

## Common Commands

```bash
# View application logs
docker-compose -f deployment/docker-compose.yml logs -f app

# Restart application
docker-compose -f deployment/docker-compose.yml restart

# Stop application
docker-compose -f deployment/docker-compose.yml down

# Update application
git pull && ./deployment/deploy.sh

# Renew SSL certificate
sudo certbot renew && docker-compose -f deployment/docker-compose.yml restart nginx
```

## Troubleshooting

### Database Connection Issues
- Verify your Supabase DATABASE_URL is correct
- Check if your VPS IP is allowed in Supabase network settings
- Ensure the database tables exist

### SSL Issues
- Make sure your domain is pointed to the VPS IP
- Wait for DNS propagation (up to 24 hours)
- Check firewall settings (ports 80, 443 should be open)

### Application Not Starting
- Check logs: `docker-compose -f deployment/docker-compose.yml logs`
- Verify .env file configuration
- Ensure all required secrets are set

### Permission Issues
- Check file ownership: `sudo chown -R $USER:$USER /var/www/omg-post-studio`
- Verify Docker group membership: `groups $USER`

## Maintenance

1. **Regular Updates:**
   ```bash
   cd /var/www/omg-post-studio
   git pull
   ./deployment/deploy.sh
   ```

2. **Database Backups:**
   - Use Supabase's built-in backup features
   - Or set up automated pg_dump scripts

3. **Monitor Logs:**
   ```bash
   # Application logs
   docker-compose logs -f app
   
   # Nginx logs
   docker-compose logs -f nginx
   
   # System logs
   journalctl -f
   ```

4. **Security Updates:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Supabase PostgreSQL connection string | `postgresql://postgres:password@db.project.supabase.co:5432/postgres` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-super-secret-key-here` |
| `NODE_ENV` | Node environment | `production` |

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review application logs
3. Verify your configuration files
4. Ensure all prerequisites are met

Remember to replace placeholder values (domain names, secrets, etc.) with your actual values before deployment.
