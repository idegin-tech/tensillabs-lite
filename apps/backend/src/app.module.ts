/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { OptionsModule } from './modules/options/options.module';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';
import { WorkspaceMembersModule } from './modules/workspace-members/workspace-members.module';
import { BillingModule } from './modules/billing/billing.module';
import { AppsModule } from './modules/apps/apps.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { FilesModule } from './modules/files/files.module';
import { CommentsModule } from './modules/comments/comments.module';
import { SeederModule } from './database/seeds/seeder.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    SeederModule,
    AuthModule,
    WorkspacesModule,
    WorkspaceMembersModule,
    OptionsModule,
    ProjectsModule,
    AppsModule,
    BillingModule,
    FilesModule,
    CommentsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend', '.next', 'static'),
      exclude: ['/api/v1*'],
      serveRoot: '/_next/static',
      serveStaticOptions: {
        maxAge: 31536000,
        immutable: true,
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend', 'public'),
      exclude: ['/api/v1*'],
      serveRoot: '/',
      serveStaticOptions: {
        fallthrough: true,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
