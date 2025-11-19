FROM node:18-alpine as build

# Build cache buster - update this comment to force rebuild: v1.0.3
WORKDIR /app

# Copy root package.json first (if exists for turbo/workspace setup)
COPY package*.json ./

# Copy backend package.json and install dependencies
COPY apps/backend/package*.json ./apps/backend/
WORKDIR /app/apps/backend
RUN npm install
WORKDIR /app

# Copy frontend package.json and install dependencies
COPY apps/frontend/package*.json ./apps/frontend/
WORKDIR /app/apps/frontend
RUN npm install
WORKDIR /app

# Copy environment and config files
COPY .env* ./

# Copy backend source code and configs
COPY apps/backend/tsconfig*.json apps/backend/nest-cli.json ./apps/backend/
COPY apps/backend/src/ ./apps/backend/src/

# Copy frontend source code and configs
COPY apps/frontend/ ./apps/frontend/

# Build frontend first (creates .next directory)
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

# Copy built backend
COPY --from=build /app/apps/backend/dist ./dist

# Copy built frontend (.next directory)
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
