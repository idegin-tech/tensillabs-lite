/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as MongoDBStore from 'connect-mongodb-session';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn']
        : ['log', 'debug', 'error', 'verbose', 'warn'],
  });

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  console.log('[DEBUG] Session configuration:', {
    sessionSecret: process.env.SESSION_SECRET ? 'SET' : 'NOT SET',
    mongoUri: process.env.MONGODB_URI ? 'SET' : 'NOT SET',
    nodeEnv: process.env.NODE_ENV,
  });

  const MongoStore = MongoDBStore(session);

  const sessionStore = new MongoStore({
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/tensillabs-lite',
    databaseName: 'tensillabs-lite',
    collection: 'sessions',
  });

  sessionStore.on('error', (error) => {
    console.error('[SESSION STORE ERROR]:', error);
  });

  sessionStore.on('connected', () => {
    console.log('[SESSION STORE] Connected to MongoDB successfully');
  });

  sessionStore.on('disconnected', () => {
    console.log('[SESSION STORE] Disconnected from MongoDB');
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

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Member-ID',
      'X-Timezone',
      'X-User-DateTime',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    exposedHeaders: ['X-Member-ID', 'X-Timezone', 'X-User-DateTime'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });
  app.setGlobalPrefix('api/v1');

  app.enableShutdownHooks();

  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');

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
