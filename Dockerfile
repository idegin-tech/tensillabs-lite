FROM node:18-alpine as build

# Build cache buster - update this comment to force rebuild: v1.0.2
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

# Build frontend first (creates 'out' directory)
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
    && rm -rf /var/lib/apt/lists/*

RUN wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | apt-key add -
RUN echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list

RUN apt-get update && apt-get install -y mongodb-org && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy backend package.json and install production dependencies
COPY apps/backend/package*.json ./
RUN npm ci --only=production

# Copy built backend
COPY --from=build /app/apps/backend/dist ./dist

# Copy built frontend (static export in 'out' directory)
COPY --from=build /app/apps/frontend/out ./frontend/out

# Copy environment file
COPY --from=build /app/.env ./

RUN mkdir -p /data/db

EXPOSE 3000

COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

CMD ["./entrypoint.sh"]
