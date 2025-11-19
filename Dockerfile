# MAJOR CACHE BUSTER - FORCE FRESH BUILD FOR .NEXT FIX - v2.0.0
FROM node:18-alpine as build

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/
COPY apps/frontend/package*.json ./apps/frontend/

# Install backend dependencies
WORKDIR /app/apps/backend
RUN npm ci --only=production && npm install --save-dev typescript @nestjs/cli

# Install frontend dependencies  
WORKDIR /app/apps/frontend
RUN npm ci

# Return to root
WORKDIR /app

# Copy environment and source files
COPY .env* ./
COPY apps/backend/tsconfig*.json apps/backend/nest-cli.json ./apps/backend/
COPY apps/backend/src/ ./apps/backend/src/
COPY apps/frontend/ ./apps/frontend/

# Build frontend (creates .next directory)
WORKDIR /app/apps/frontend
RUN npm run build

# Build backend
WORKDIR /app/apps/backend
RUN npm run build

FROM node:18-slim as runtime

RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    netcat-openbsd \
    curl \
    postgresql \
    postgresql-contrib \
    sudo \
    && rm -rf /var/lib/apt/lists/*

# Create postgres user and set up PostgreSQL
RUN useradd -m postgres || true
RUN mkdir -p /var/lib/postgresql/data
RUN chown -R postgres:postgres /var/lib/postgresql/data
RUN chmod 700 /var/lib/postgresql/data

# Allow postgres user to run initdb without password
RUN echo "postgres ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

WORKDIR /app

# Copy backend package.json and install production dependencies
COPY apps/backend/package*.json ./
RUN npm ci --only=production

# Copy built backend from correct path
COPY --from=build /app/apps/backend/dist ./dist

# Copy built frontend (.next directory) - NOT dist!
COPY --from=build /app/apps/frontend/.next ./frontend/.next
COPY --from=build /app/apps/frontend/package.json ./frontend/package.json
COPY --from=build /app/apps/frontend/next.config.ts ./frontend/next.config.ts
COPY --from=build /app/apps/frontend/public ./frontend/public

# Copy environment file
COPY --from=build /app/.env ./

EXPOSE 8080

COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

CMD ["./entrypoint.sh"]
