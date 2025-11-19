import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Checklist } from './schemas/checklist.schema';
import { ChecklistController } from './checklist.controller';
import { ChecklistService } from './services/checklist.service';
import { WorkspacesModule } from '../workspaces/workspaces.module';
import { WorkspaceMembersModule } from '../workspace-members/workspace-members.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Checklist]),
    AuthModule,
    WorkspaceMembersModule,
    WorkspacesModule,
  ],
  controllers: [ChecklistController],
  providers: [ChecklistService],
  exports: [ChecklistService],
})
export class ChecklistModule {}
