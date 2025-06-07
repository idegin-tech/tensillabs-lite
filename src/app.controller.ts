import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseHealthService } from './database/database-health.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly databaseHealthService: DatabaseHealthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  async getHealth() {
    const dbHealth = await this.databaseHealthService.checkHealth();

    return {
      status: dbHealth.status,
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealth,
      },
    };
  }

  @Get('health/database')
  async getDatabaseHealth() {
    return this.databaseHealthService.checkHealth();
  }
}
