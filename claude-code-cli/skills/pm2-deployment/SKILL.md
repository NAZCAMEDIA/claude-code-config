---
name: pm2-deployment
description: Manages PM2 process deployments for Node.js applications on production servers. This skill should be used when deploying to production, managing process clusters, configuring ecosystem files, or setting up monitoring for Node.js services.
---

# PM2 Deployment

This skill manages PM2 process deployments for Node.js applications following SOLARIA deployment patterns.

## Quick Commands

```bash
# Status
pm2 status
pm2 list

# Manage processes
pm2 start app.js
pm2 restart app
pm2 stop app
pm2 delete app

# Logs
pm2 logs
pm2 logs app --lines 100

# Monitoring
pm2 monit
```

## Ecosystem File

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'api',
      script: 'dist/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
    {
      name: 'worker',
      script: 'dist/worker.js',
      instances: 2,
      exec_mode: 'cluster',
      autorestart: true,
      cron_restart: '0 0 * * *',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
  deploy: {
    production: {
      user: 'root',
      host: '46.62.222.138',
      ref: 'origin/main',
      repo: 'git@github.com:user/repo.git',
      path: '/var/www/app',
      'pre-deploy': 'git fetch --all',
      'post-deploy': 'npm ci && npm run build && pm2 reload ecosystem.config.js --env production',
    },
  },
}
```

## Deployment Workflow

### Initial Setup
```bash
# On local machine
pm2 deploy production setup
```

### Deploy
```bash
# Full deploy
pm2 deploy production

# Or manually on server
ssh solaria-hetzner-prod
cd /var/www/app
git pull
npm ci
npm run build
pm2 reload ecosystem.config.js --env production
```

### Rollback
```bash
pm2 deploy production revert 1
```

## Cluster Mode

```javascript
// For CPU-intensive apps
{
  name: 'api',
  script: 'dist/index.js',
  instances: 'max',        // Use all CPUs
  exec_mode: 'cluster',    // Enable clustering
  instance_var: 'INSTANCE_ID',
}
```

## Log Management

```bash
# View logs
pm2 logs api
pm2 logs api --lines 200
pm2 logs --format

# Clear logs
pm2 flush

# Log rotation
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

## Monitoring

```bash
# Terminal monitor
pm2 monit

# Web dashboard
pm2 plus  # PM2 cloud monitoring
```

## Startup Script

```bash
# Generate startup script
pm2 startup

# Save current process list
pm2 save

# Resurrect saved processes
pm2 resurrect
```

## Health Checks

```javascript
// In your app
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  })
})
```

## Zero-Downtime Reload

```bash
# Graceful reload (cluster mode)
pm2 reload api

# Force restart
pm2 restart api
```

## Environment Variables

```bash
# Set env for specific process
pm2 start app.js --env production

# Update env
pm2 restart api --update-env
```

## Common Issues

### Process Keeps Crashing
```bash
# Check logs
pm2 logs api --err --lines 100

# Check memory
pm2 describe api

# Increase memory limit
pm2 start app.js --max-memory-restart 2G
```

### Port Already in Use
```bash
# Find process using port
lsof -i :3000

# Kill if needed
kill -9 <PID>
```

## Scripts

### Deploy Script
```bash
#!/bin/bash
# scripts/deploy.sh

set -e

echo "Pulling latest changes..."
git pull origin main

echo "Installing dependencies..."
npm ci

echo "Building..."
npm run build

echo "Reloading PM2..."
pm2 reload ecosystem.config.js --env production

echo "Saving PM2 state..."
pm2 save

echo "Deployment complete!"
pm2 status
```

## Resources

- [Ecosystem Config Template](assets/ecosystem.config.js)
- [Deploy Script](scripts/deploy.sh)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
