import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskController } from './task.controller';
import { TaskService } from './services/task.service';
import { Task, TaskSchema } from './schemas/task.schema';
import {
  SpaceParticipant,
  SpaceParticipantSchema,
} from '../space-participants/schemas/space-participant.schema';
import { List, ListSchema } from '../lists/schemas/list.schema';
import { WorkspaceMembersModule } from '../../../workspace-members/workspace-members.module';
import { AuthModule } from '../../../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: SpaceParticipant.name, schema: SpaceParticipantSchema },
      { name: List.name, schema: ListSchema },
    ]),
    WorkspaceMembersModule,
    AuthModule,
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService, MongooseModule],
})
export class TasksModule {}
