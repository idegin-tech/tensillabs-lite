import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

export const getDatabaseConfig = (
  configService: ConfigService,
): MongooseModuleOptions => {
  const mongoUri = configService.get<string>('MONGODB_URI');

  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }

  const isProduction = configService.get<string>('NODE_ENV') === 'production';

  return {
    uri: mongoUri,
    retryAttempts: 3,
    retryDelay: 1000,
    connectTimeoutMS: 30000,
    serverSelectionTimeoutMS: 5000,
    heartbeatFrequencyMS: 10000,
    maxPoolSize: isProduction ? 10 : 5,
    minPoolSize: isProduction ? 2 : 1,
    maxIdleTimeMS: 30000,
    bufferCommands: false,
    socketTimeoutMS: 45000,
    connectionFactory: (connection: Connection) => {
      connection.on('connected', () => {
        console.log('MongoDB connected successfully');
      });

      connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
      });

      connection.on('error', (error: Error) => {
        console.error('MongoDB connection error:', error);
      });

      connection.on('reconnected', () => {
        console.log('MongoDB reconnected');
      });

      connection.on('close', () => {
        console.log('MongoDB connection closed');
      });

      return connection;
    },
  };
};
