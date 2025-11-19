FROM node:18-alpine as build

# Build cache buster - fixed .next directory issue: v1.0.4
WORKDIR /app

# Copy root package.json first (if exists for turbo/workspace setup)
COPY package*.json ./

# Copy backend package.json and install dependencies
COPY apps/backend/package*.json ./
RUN npm install

# Copy frontend package.json and install dependencies
COPY apps/frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm install
WORKDIR /app

# Copy environment and config files
COPY .env* ./

# Copy backend source code and configs
COPY apps/backend/tsconfig*.json apps/backend/nest-cli.json ./
COPY apps/backend/src/ ./src/

# Copy frontend source code and configs
COPY apps/frontend/ ./frontend/

# Build frontend first (creates .next directory)
WORKDIR /app/frontend
RUN npm run build

# Build backend
WORKDIR /app
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
COPY --from=build /app/dist ./dist

# Copy built frontend (.next directory)
COPY --from=build /app/frontend/.next ./frontend/.next
COPY --from=build /app/frontend/package.json ./frontend/package.json
COPY --from=build /app/frontend/next.config.ts ./frontend/next.config.ts
COPY --from=build /app/frontend/public ./frontend/public

# Copy environment file
COPY --from=build /app/.env ./

EXPOSE 8080

COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

CMD ["./entrypoint.sh"]
