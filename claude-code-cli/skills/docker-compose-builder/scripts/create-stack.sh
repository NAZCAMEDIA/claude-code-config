#!/bin/bash
# SOLARIA Docker Compose Stack Creator
# Usage: bash create-stack.sh [template] [project-name]
# Templates: mern, pern, wordpress, custom

TEMPLATE="${1:-custom}"
PROJECT_NAME="${2:-my-project}"
DATE=$(date +%Y-%m-%d)

echo "Creating Docker Compose stack..."
echo "Template: $TEMPLATE"
echo "Project: $PROJECT_NAME"
echo ""

# Create directories
mkdir -p "$PROJECT_NAME"/{backend,frontend,nginx/conf.d,database/migrations,certbot/{www,conf}}

# Create .env.example
cat > "$PROJECT_NAME/.env.example" << 'EOF'
# Project
PROJECT_NAME=my-project
NODE_ENV=development

# MySQL
MYSQL_ROOT_PASSWORD=rootpassword_change_me
MYSQL_DATABASE=app_db
MYSQL_USER=app_user
MYSQL_PASSWORD=userpassword_change_me
MYSQL_PORT=3306

# PostgreSQL
POSTGRES_DB=app_db
POSTGRES_USER=app_user
POSTGRES_PASSWORD=userpassword_change_me
POSTGRES_PORT=5432

# Redis
REDIS_PASSWORD=redispassword_change_me
REDIS_PORT=6379

# Backend
BACKEND_PORT=3000
JWT_SECRET=your_jwt_secret_change_me

# Frontend
FRONTEND_PORT=5173
VITE_API_URL=http://localhost:3000/api
EOF

# Create docker-compose.yml based on template
case $TEMPLATE in
    mern)
        cat > "$PROJECT_NAME/docker-compose.yml" << 'EOF'
version: '3.8'

services:
  mongo:
    image: mongo:7
    container_name: ${PROJECT_NAME}-mongo
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USER:-admin}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD:-password}
    volumes:
      - mongo_data:/data/db
    networks:
      - backend

  redis:
    image: redis:7-alpine
    container_name: ${PROJECT_NAME}-redis
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    networks:
      - backend

  backend:
    build: ./backend
    container_name: ${PROJECT_NAME}-backend
    restart: unless-stopped
    environment:
      NODE_ENV: ${NODE_ENV:-development}
      PORT: 3000
      MONGO_URL: mongodb://${MONGO_USER:-admin}:${MONGO_PASSWORD:-password}@mongo:27017
    ports:
      - "${BACKEND_PORT:-3000}:3000"
    volumes:
      - ./backend:/app
      - /app/node_modules
    depends_on:
      - mongo
      - redis
    networks:
      - backend

  frontend:
    build: ./frontend
    container_name: ${PROJECT_NAME}-frontend
    restart: unless-stopped
    ports:
      - "${FRONTEND_PORT:-5173}:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    networks:
      - frontend

networks:
  frontend:
  backend:

volumes:
  mongo_data:
  redis_data:
EOF
        ;;

    pern)
        cat > "$PROJECT_NAME/docker-compose.yml" << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: ${PROJECT_NAME}-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-app_db}
      POSTGRES_USER: ${POSTGRES_USER:-app_user}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-password}
    ports:
      - "${POSTGRES_PORT:-5432}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/migrations:/docker-entrypoint-initdb.d
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-app_user}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - backend

  redis:
    image: redis:7-alpine
    container_name: ${PROJECT_NAME}-redis
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    networks:
      - backend

  backend:
    build: ./backend
    container_name: ${PROJECT_NAME}-backend
    restart: unless-stopped
    environment:
      NODE_ENV: ${NODE_ENV:-development}
      PORT: 3000
      DATABASE_URL: postgresql://${POSTGRES_USER:-app_user}:${POSTGRES_PASSWORD:-password}@postgres:5432/${POSTGRES_DB:-app_db}
    ports:
      - "${BACKEND_PORT:-3000}:3000"
    volumes:
      - ./backend:/app
      - /app/node_modules
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - backend

  frontend:
    build: ./frontend
    container_name: ${PROJECT_NAME}-frontend
    restart: unless-stopped
    ports:
      - "${FRONTEND_PORT:-5173}:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    networks:
      - frontend

networks:
  frontend:
  backend:

volumes:
  postgres_data:
  redis_data:
EOF
        ;;

    wordpress)
        cat > "$PROJECT_NAME/docker-compose.yml" << 'EOF'
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: ${PROJECT_NAME}-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:-rootpassword}
      MYSQL_DATABASE: ${MYSQL_DATABASE:-wordpress}
      MYSQL_USER: ${MYSQL_USER:-wordpress}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD:-wordpress}
    volumes:
      - mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - backend

  wordpress:
    image: wordpress:latest
    container_name: ${PROJECT_NAME}-wordpress
    restart: unless-stopped
    environment:
      WORDPRESS_DB_HOST: mysql:3306
      WORDPRESS_DB_USER: ${MYSQL_USER:-wordpress}
      WORDPRESS_DB_PASSWORD: ${MYSQL_PASSWORD:-wordpress}
      WORDPRESS_DB_NAME: ${MYSQL_DATABASE:-wordpress}
    ports:
      - "8080:80"
    volumes:
      - wordpress_data:/var/www/html
      - ./wp-content:/var/www/html/wp-content
    depends_on:
      mysql:
        condition: service_healthy
    networks:
      - backend

networks:
  backend:

volumes:
  mysql_data:
  wordpress_data:
EOF
        ;;

    *)
        cat > "$PROJECT_NAME/docker-compose.yml" << 'EOF'
version: '3.8'

services:
  # Add your services here
  # Example:
  # app:
  #   build: .
  #   ports:
  #     - "3000:3000"

networks:
  default:
    driver: bridge

volumes:
  # Add your volumes here
EOF
        ;;
esac

# Create basic nginx config
cat > "$PROJECT_NAME/nginx/conf.d/default.conf" << 'EOF'
upstream backend {
    server backend:3000;
}

upstream frontend {
    server frontend:5173;
}

server {
    listen 80;
    server_name localhost;

    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Create .gitignore
cat > "$PROJECT_NAME/.gitignore" << 'EOF'
.env
node_modules/
dist/
*.log
.DS_Store
EOF

echo "✓ Created stack in ./$PROJECT_NAME/"
echo ""
echo "Next steps:"
echo "1. cd $PROJECT_NAME"
echo "2. cp .env.example .env"
echo "3. Edit .env with your values"
echo "4. docker-compose up -d"
