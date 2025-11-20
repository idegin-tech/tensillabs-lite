/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as connectPgSimple from 'connect-pg-simple';
import * as express from 'express';
import { Pool } from 'pg';
import { TransformIdInterceptor } from './lib/interceptors/transform-id.interceptor';
const next = require('next');
import { parse } from 'url';
import { join } from 'path';

async function bootstrap() {
  const dev = process.env.NODE_ENV !== 'production';
  const frontendDir = join(__dirname, '..', '..', 'frontend');
  
  console.log('Starting backend server...');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Frontend directory:', frontendDir);

  let nextjsApp;
  let handle;

  // Initialize Next.js in development or if frontend build exists in production
  try {
    const fs = require('fs');
    const nextBuildExists = fs.existsSync(join(frontendDir, '.next'));
    
    if (dev || nextBuildExists) {
      console.log('Next.js initializing...');
      nextjsApp = next({ 
        dev, 
        dir: frontendDir,
        conf: {
          distDir: '.next'
        }
      });
      handle = nextjsApp.getRequestHandler();
      await nextjsApp.prepare();
      console.log('Next.js initialized successfully');
    } else {
      console.warn('Next.js build not found, running without frontend serving');
    }
  } catch (error) {
    console.error('Failed to prepare Next.js app:', error);
    console.warn('Continuing without Next.js...');
  }

  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn']
        : ['log', 'debug', 'error', 'verbose', 'warn'],
  });

  app.useGlobalInterceptors(new TransformIdInterceptor());

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);

  app.enableCors({
    origin: [
      process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
      'http://localhost:3001',
      'http://localhost:3037',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:3037',
    ],
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Member-ID',
      'X-Timezone',
      'X-User-DateTime',
      'X-Request-ID',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    exposedHeaders: ['X-Member-ID', 'X-Timezone', 'X-User-DateTime'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  console.log('[DEBUG] Session configuration:', {
    sessionSecret: process.env.SESSION_SECRET ? 'SET' : 'NOT SET',
    databaseHost: process.env.DATABASE_HOST ? 'SET' : 'NOT SET',
    nodeEnv: process.env.NODE_ENV,
  });

  const PgSession = connectPgSimple(session);

  const pgPool = new Pool({
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'tensillabs_lite',
  });

  const sessionStore = new PgSession({
    pool: pgPool,
    tableName: 'sessions',
    createTableIfMissing: true,
  });

  sessionStore.on('error', (error) => {
    console.error('[SESSION STORE ERROR]:', error);
  });

  pgPool.on('connect', () => {
    console.log('[SESSION STORE] Connected to PostgreSQL successfully');
  });

  pgPool.on('error', (error) => {
    console.error('[SESSION POOL ERROR]:', error);
  });

  app.use(
    session({
      secret: String(process.env.SESSION_SECRET || 'fallback-secret'),
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
      cookie: {
        maxAge: 5 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      },
      name: 'connect.sid',
    }),
  );

  app.setGlobalPrefix('api/v1');

  app.enableShutdownHooks();

  const port = process.env.PORT || 8987;

  await app.listen(port, '0.0.0.0');

  // Add Next.js handler AFTER NestJS has started and set up all routes
  if (handle) {
    expressApp.use((req, res, next) => {
      // Skip API routes - let NestJS handle them
      if (req.path.startsWith('/api/v1/') || req.path.startsWith('/api/')) {
        return next();
      }
      
      // Handle Next.js routes
      const parsedUrl = parse(req.url, true);
      return handle(req, res, parsedUrl);
    });
    console.log('Next.js route handler installed for all non-API routes');
  }

  console.log(`Application is running on: http://0.0.0.0:${port}`);

  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    app
      .close()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  });

  process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully...');
    app
      .close()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});