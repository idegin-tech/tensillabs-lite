import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './task.controller';
import { TaskService } from './services/task.service';
import { Task } from './schemas/task.schema';
import { List } from '../lists/schemas/list.schema';
import { Space } from '../schemas/space.schema';
import { SpaceParticipant } from '../space-participants/schemas/space-participant.schema';
import { WorkspaceMembersModule } from '../../../workspace-members/workspace-members.module';
import { AuthModule } from '../../../auth/auth.module';
import { WorkspacesModule } from '../../../workspaces/workspaces.module';
import { ChecklistModule } from 'src/modules/checklists/checklist.module';
import { FilesModule } from '../../../files/files.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, List, Space, SpaceParticipant]),
    WorkspaceMembersModule,
    AuthModule,
    WorkspacesModule,
    ChecklistModule,
    FilesModule,
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService, TypeOrmModule],
})
export class TasksModule {}
