import { z } from 'zod';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('8987'),
  
  // Database
  DATABASE_HOST: z.string(),
  DATABASE_PORT: z.string().transform(Number),
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_NAME: z.string(),
  
  // Session
  SESSION_SECRET: z.string().min(32),
  
  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  
  // SMTP
  SMTP_TOKEN: z.string(),
  
  // Frontend URLs
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  
  // APP_KEY (Required in production and for seeding)
  APP_KEY: z.string(),
  APP_KEY_SECRET: z.string().optional(),
});

export type Environment = z.infer<typeof envSchema>;

@Injectable()
export class EnvironmentValidationService {
  constructor(private configService: ConfigService) {}

  validateEnvironment(): Environment {
    const env: Record<string, any> = {};
    
    // Get all required environment variables
    const envVars = [
      'NODE_ENV', 'PORT', 'DATABASE_HOST', 'DATABASE_PORT', 'DATABASE_USER', 
      'DATABASE_PASSWORD', 'DATABASE_NAME', 'SESSION_SECRET', 
      'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET',
      'SMTP_TOKEN', 'NEXT_PUBLIC_API_URL', 'NEXT_PUBLIC_APP_URL', 'APP_KEY', 'APP_KEY_SECRET'
    ];

    envVars.forEach(key => {
      env[key] = this.configService.get(key);
    });

    try {
      return envSchema.parse(env);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const missingVars = error.errors
          .filter(err => err.code === 'invalid_type' && err.received === 'undefined')
          .map(err => err.path.join('.'));
        
        const invalidVars = error.errors
          .filter(err => err.code !== 'invalid_type' || err.received !== 'undefined')
          .map(err => `${err.path.join('.')}: ${err.message}`);

        let errorMessage = 'Environment validation failed:\n';
        
        if (missingVars.length > 0) {
          errorMessage += `Missing required variables: ${missingVars.join(', ')}\n`;
        }
        
        if (invalidVars.length > 0) {
          errorMessage += `Invalid variables: ${invalidVars.join(', ')}\n`;
        }

        throw new Error(errorMessage);
      }
      throw error;
    }
  }
}

export function validateEnvironment(config: Record<string, unknown>): Environment {
  try {
    return envSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .filter(err => err.code === 'invalid_type' && err.received === 'undefined')
        .map(err => err.path.join('.'));
      
      const invalidVars = error.errors
        .filter(err => err.code !== 'invalid_type' || err.received !== 'undefined')
        .map(err => `${err.path.join('.')}: ${err.message}`);

      let errorMessage = 'Environment validation failed:\n';
      
      if (missingVars.length > 0) {
        errorMessage += `Missing required variables: ${missingVars.join(', ')}\n`;
      }
      
      if (invalidVars.length > 0) {
        errorMessage += `Invalid variables: ${invalidVars.join(', ')}\n`;
      }

      throw new Error(errorMessage);
    }
    throw error;
  }
}