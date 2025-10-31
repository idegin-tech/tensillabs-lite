import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseHealthService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async checkHealth(): Promise<{
    status: string;
    message: string;
    details: {
      isInitialized: boolean;
      isConnected: boolean;
    };
  }> {
    try {
      if (this.dataSource.isInitialized) {
        await this.dataSource.query('SELECT 1');

        return {
          status: 'healthy',
          message: 'Database connection is active and responsive',
          details: {
            isInitialized: this.dataSource.isInitialized,
            isConnected: this.dataSource.isInitialized,
          },
        };
      } else {
        return {
          status: 'unhealthy',
          message: 'Database connection is not initialized',
          details: {
            isInitialized: this.dataSource.isInitialized,
            isConnected: false,
          },
        };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return {
        status: 'unhealthy',
        message: `Database health check failed: ${errorMessage}`,
        details: {
          isInitialized: this.dataSource.isInitialized,
          isConnected: false,
        },
      };
    }
  }

  getConnectionState(): string {
    return this.dataSource.isInitialized ? 'connected' : 'disconnected';
  }
}
