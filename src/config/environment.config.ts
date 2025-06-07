export interface EnvironmentVariables {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  MONGODB_URI: string;
}

export const validateEnvironment = (): EnvironmentVariables => {
  const { NODE_ENV, PORT, MONGODB_URI } = process.env;

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is required');
  }

  return {
    NODE_ENV: (NODE_ENV as EnvironmentVariables['NODE_ENV']) || 'development',
    PORT: PORT ? parseInt(PORT, 10) : 3000,
    MONGODB_URI,
  };
};
