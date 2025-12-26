---
name: docker-compose-builder
description: Creates Docker Compose configurations for multi-service architectures following SOLARIA infrastructure patterns. This skill should be used when setting up development environments, CI/CD pipelines, or production deployments with services like MySQL, PostgreSQL, Redis, Node.js, Nginx, and more.
---

# Docker Compose Builder

This skill creates production-ready Docker Compose configurations for multi-service architectures, following SOLARIA infrastructure patterns.

## When to Use

- Setting up local development environments
- Creating production deployment configurations
- Adding new services to existing stacks
- Configuring database, cache, or queue services
- Setting up reverse proxies and SSL termination
- Building CI/CD testing environments

## Common Stack Templates

### MERN Stack (MongoDB, Express, React, Node.js)
```bash
bash scripts/create-stack.sh mern my-project
```

### PERN Stack (PostgreSQL, Express, React, Node.js)
```bash
bash scripts/create-stack.sh pern my-project
```

### WordPress (Apache/Nginx, PHP, MySQL)
```bash
bash scripts/create-stack.sh wordpress my-project
```

### Custom Stack
```bash
bash scripts/create-stack.sh custom my-project
# Then add services manually
```

## Service Catalog

### Databases

#### MySQL 8.0
```yaml
services:
  mysql:
    image: mysql:8.0
    container_name: ${PROJECT_NAME}-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    ports:
      - "${MYSQL_PORT:-3306}:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database/init:/docker-entrypoint-initdb.d
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - backend
```

#### PostgreSQL 16
```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: ${PROJECT_NAME}-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    ports:
      - "${POSTGRES_PORT:-5432}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init:/docker-entrypoint-initdb.d
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - backend
```

#### MongoDB 7
```yaml
services:
  mongo:
    image: mongo:7
    container_name: ${PROJECT_NAME}-mongo
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
      MONGO_INITDB_DATABASE: ${MONGO_DATABASE}
    ports:
      - "${MONGO_PORT:-27017}:27017"
    volumes:
      - mongo_data:/data/db
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - backend
```

### Cache & Queues

#### Redis 7
```yaml
services:
  redis:
    image: redis:7-alpine
    container_name: ${PROJECT_NAME}-redis
    restart: unless-stopped
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    ports:
      - "${REDIS_PORT:-6379}:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - backend
```

### Web Servers

#### Nginx (Reverse Proxy)
```yaml
services:
  nginx:
    image: nginx:alpine
    container_name: ${PROJECT_NAME}-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./certbot/www:/var/www/certbot:ro
      - ./certbot/conf:/etc/letsencrypt:ro
    depends_on:
      - backend
      - frontend
    networks:
      - frontend
      - backend
```

### Applications

#### Node.js Backend
```yaml
services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: ${PROJECT_NAME}-backend
    restart: unless-stopped
    environment:
      NODE_ENV: ${NODE_ENV:-production}
      PORT: ${BACKEND_PORT:-3000}
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: ${REDIS_URL}
    ports:
      - "${BACKEND_PORT:-3000}:3000"
    volumes:
      - ./backend:/app
      - /app/node_modules
    depends_on:
      mysql:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - backend
```

#### React Frontend (Dev)
```yaml
services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    container_name: ${PROJECT_NAME}-frontend
    restart: unless-stopped
    environment:
      VITE_API_URL: ${VITE_API_URL}
    ports:
      - "${FRONTEND_PORT:-5173}:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    networks:
      - frontend
```

## Complete Example: SOLARIA Stack

```yaml
version: '3.8'

services:
  # Database
  mysql:
    image: mysql:8.0
    container_name: solaria-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database/migrations:/docker-entrypoint-initdb.d
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - backend

  # Cache
  redis:
    image: redis:7-alpine
    container_name: solaria-redis
    restart: unless-stopped
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - backend

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: solaria-backend
    restart: unless-stopped
    environment:
      NODE_ENV: production
      PORT: 3000
      DATABASE_URL: mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@mysql:3306/${MYSQL_DATABASE}
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      mysql:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - backend

  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: solaria-frontend
    restart: unless-stopped
    networks:
      - frontend

  # Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: solaria-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./certbot/www:/var/www/certbot:ro
      - ./certbot/conf:/etc/letsencrypt:ro
    depends_on:
      - backend
      - frontend
    networks:
      - frontend
      - backend

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge

volumes:
  mysql_data:
  redis_data:
```

## Environment Template (.env.example)

```bash
# Project
PROJECT_NAME=solaria
NODE_ENV=development

# MySQL
MYSQL_ROOT_PASSWORD=rootpassword_change_me
MYSQL_DATABASE=solaria_db
MYSQL_USER=solaria_user
MYSQL_PASSWORD=userpassword_change_me
MYSQL_PORT=3306

# PostgreSQL (alternative)
POSTGRES_DB=solaria_db
POSTGRES_USER=solaria_user
POSTGRES_PASSWORD=userpassword_change_me
POSTGRES_PORT=5432

# Redis
REDIS_PASSWORD=redispassword_change_me
REDIS_PORT=6379

# Backend
BACKEND_PORT=3000
JWT_SECRET=your_jwt_secret_change_me
DATABASE_URL=mysql://solaria_user:userpassword_change_me@mysql:3306/solaria_db
REDIS_URL=redis://:redispassword_change_me@redis:6379

# Frontend
FRONTEND_PORT=5173
VITE_API_URL=http://localhost:3000/api
```

## Dockerfile Templates

### Node.js Backend
```dockerfile
# backend/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

### React Frontend (Production)
```dockerfile
# frontend/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Common Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f [service]

# Stop all services
docker-compose down

# Stop and remove volumes (DANGER: deletes data)
docker-compose down -v

# Rebuild specific service
docker-compose build --no-cache backend

# Execute command in container
docker-compose exec backend npm run migrate

# View running containers
docker-compose ps

# Scale service
docker-compose up -d --scale backend=3
```

## Health Check Patterns

Always include health checks for dependent services:

```yaml
depends_on:
  mysql:
    condition: service_healthy
  redis:
    condition: service_healthy
```

## Security Best Practices

1. **Never hardcode secrets** - Use environment variables
2. **Use specific image versions** - Not `latest`
3. **Run as non-root user** when possible
4. **Limit exposed ports** - Only what's necessary
5. **Use internal networks** for service-to-service communication
6. **Enable read-only filesystems** where possible

## Scripts

### Create New Stack
```bash
bash scripts/create-stack.sh [template] [project-name]
```

### Validate Compose File
```bash
bash scripts/validate-compose.sh docker-compose.yml
```

### Generate .env from .env.example
```bash
bash scripts/generate-env.sh
```

## Resources

- [Service Templates](references/service-templates.md)
- [Nginx Configurations](references/nginx-configs.md)
- [Dockerfile Examples](references/dockerfiles.md)
- [Create Stack Script](scripts/create-stack.sh)
