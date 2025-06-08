import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import connectMongo from 'connect-mongo';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn']
        : ['log', 'debug', 'error', 'verbose', 'warn'],
  });

  app.use(cookieParser());

  console.log('[DEBUG] Session configuration:', {
    sessionSecret: process.env.SESSION_SECRET ? 'SET' : 'NOT SET',
    mongoUri: process.env.MONGODB_URI,
    nodeEnv: process.env.NODE_ENV,
  });

  const sessionStore = connectMongo?.create({
    mongoUrl: process.env.MONGODB_URI,
    dbName: 'tensillabs-lite',
    collectionName: 'sessions',
    touchAfter: 24 * 3600,
  });

  app.use(
    session({
      secret: String(process.env.SESSION_SECRET),
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
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    exposedHeaders: ['X-Member-ID', 'X-Timezone'],
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
