import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskController } from './task.controller';
import { TaskService } from './services/task.service';
import { Task, TaskSchema } from './schemas/task.schema';
import { List, ListSchema } from '../lists/schemas/list.schema';
import { Space, SpaceSchema } from '../schemas/space.schema';
import {
  SpaceParticipant,
  SpaceParticipantSchema,
} from '../space-participants/schemas/space-participant.schema';
import { WorkspaceMembersModule } from '../../../workspace-members/workspace-members.module';
import { AuthModule } from '../../../auth/auth.module';
import { WorkspacesModule } from '../../../workspaces/workspaces.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: List.name, schema: ListSchema },
      { name: Space.name, schema: SpaceSchema },
      { name: SpaceParticipant.name, schema: SpaceParticipantSchema },
    ]),
    WorkspaceMembersModule,
    AuthModule,
    WorkspacesModule,
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService, MongooseModule],
})
export class TasksModule {}
