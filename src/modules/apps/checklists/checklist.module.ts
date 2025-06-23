/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Checklist, ChecklistSchema } from './schemas/checklist.schema';
import { ChecklistController } from './checklist.controller';
import { ChecklistService } from './services/checklist.service';
import { AuthModule } from '../../auth/auth.module';
import { WorkspaceMembersModule } from '../../workspace-members/workspace-members.module';
import { WorkspacesModule } from '../../workspaces/workspaces.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Checklist.name, schema: ChecklistSchema },
    ]),
    AuthModule,
    WorkspaceMembersModule,
    WorkspacesModule,
  ],
  controllers: [ChecklistController],
  providers: [ChecklistService],
  exports: [ChecklistService],
})
export class ChecklistModule {}
