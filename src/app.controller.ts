import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseHealthService } from './database/database-health.service';
import { createSuccessResponse } from './lib/response.interface';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly databaseHealthService: DatabaseHealthService,
  ) {}

  @Get()
  getHello() {
    return createSuccessResponse('Application is running', {
      message: this.appService.getHello(),
    });
  }

  @Get('health')
  async getHealth() {
    const dbHealth = await this.databaseHealthService.checkHealth();

    return createSuccessResponse('Health check completed', {
      status: dbHealth.status,
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealth,
      },
    });
  }

  @Get('health/database')
  async getDatabaseHealth() {
    const dbHealth = await this.databaseHealthService.checkHealth();
    return createSuccessResponse('Database health check completed', dbHealth);
  }
}
