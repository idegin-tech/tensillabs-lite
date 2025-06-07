import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

export const getDatabaseConfig = (
  configService: ConfigService,
): MongooseModuleOptions => {
  // Get MongoDB URI from environment variables
  const mongoUri = configService.get<string>('MONGODB_URI');
  const isProduction = configService.get<string>('NODE_ENV') === 'production';

  // Default fallback for development
  const defaultUri = 'mongodb://localhost:27017/tensillabs-lite';
  const finalUri = mongoUri || defaultUri;

  // Log connection (hide credentials for security)
  console.log(
    `Connecting to MongoDB: ${finalUri.replace(/\/\/.*@/, '//***:***@')}`,
  );

  return {
    uri: finalUri,
    retryAttempts: isProduction ? 5 : 3,
    retryDelay: isProduction ? 2000 : 1000,
    connectTimeoutMS: 30000,
    serverSelectionTimeoutMS: isProduction ? 10000 : 5000,
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
