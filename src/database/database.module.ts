import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { getDatabaseConfig } from '../config/database.config';
import { DatabaseHealthService } from './database-health.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
  ],
  providers: [DatabaseHealthService],
  exports: [MongooseModule, DatabaseHealthService],
})
export class DatabaseModule {}
