# MAJOR CACHE BUSTER - FORCE FRESH BUILD FOR .NEXT FIX - v2.0.0
FROM node:18-alpine as build

WORKDIR /app

# Copy root package.json and turbo.json first for better caching
COPY package*.json turbo.json ./

# Copy all package.json files for workspace dependencies
COPY apps/backend/package*.json ./apps/backend/
COPY apps/frontend/package*.json ./apps/frontend/
COPY packages/*/package*.json ./packages/*/

# Install all dependencies using npm workspaces
RUN npm ci

# Copy all source files
COPY .env* ./
COPY apps/ ./apps/
COPY packages/ ./packages/

# Build using Turbo (builds both frontend and backend)
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
COPY apps/backend/package*.json ./apps/backend/
COPY package*.json ./
RUN npm ci --only=production --workspace=apps/backend

# Copy built backend from correct path
COPY --from=build /app/apps/backend/dist ./apps/backend/dist

# Copy built frontend (.next directory) - NOT dist!
COPY --from=build /app/apps/frontend/.next ./apps/frontend/.next
COPY --from=build /app/apps/frontend/package.json ./apps/frontend/package.json
COPY --from=build /app/apps/frontend/next.config.ts ./apps/frontend/next.config.ts
COPY --from=build /app/apps/frontend/public ./apps/frontend/public

# Copy environment file
COPY --from=build /app/.env ./

EXPOSE 8080

COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

CMD ["./entrypoint.sh"]
