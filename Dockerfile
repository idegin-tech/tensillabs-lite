FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM base AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY frontend ./frontend
RUN cd frontend && (test -f package-lock.json && npm ci || npm install)

COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/frontend/dist ./frontend/dist
COPY --from=deps --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./

USER nestjs

EXPOSE 3000

ENV PORT=3000

CMD ["node", "dist/main"]
