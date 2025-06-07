import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, ConnectionStates } from 'mongoose';

@Injectable()
export class DatabaseHealthService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async checkHealth(): Promise<{
    status: string;
    message: string;
    details: {
      state: string;
      readyState: number;
    };
  }> {
    try {
      const readyState = this.connection.readyState;

      if (readyState === ConnectionStates.connected && this.connection.db) {
        await this.connection.db.admin().ping();

        return {
          status: 'healthy',
          message: 'Database connection is active and responsive',
          details: {
            state: this.getConnectionState(),
            readyState,
          },
        };
      } else {
        return {
          status: 'unhealthy',
          message: 'Database connection is not active',
          details: {
            state: this.getConnectionState(),
            readyState,
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
          state: this.getConnectionState(),
          readyState: this.connection.readyState,
        },
      };
    }
  }

  getConnectionState(): string {
    const readyState = this.connection.readyState;

    switch (readyState) {
      case ConnectionStates.disconnected:
        return 'disconnected';
      case ConnectionStates.connected:
        return 'connected';
      case ConnectionStates.connecting:
        return 'connecting';
      case ConnectionStates.disconnecting:
        return 'disconnecting';
      default:
        return 'unknown';
    }
  }
}
