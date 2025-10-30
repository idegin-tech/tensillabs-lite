import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListController, SpaceListController } from './list.controller';
import { ListService } from './services/list.service';
import { List, ListSchema } from './schemas/list.schema';
import { Task, TaskSchema } from '../tasks/schemas/task.schema';
import { Space, SpaceSchema } from '../schemas/space.schema';
import {
  SpaceParticipant,
  SpaceParticipantSchema,
} from '../space-participants/schemas/space-participant.schema';
import { WorkspaceMembersModule } from '../../../workspace-members/workspace-members.module';
import { AuthModule } from '../../../auth/auth.module';
import { WorkspacesModule } from '../../../workspaces/workspaces.module';
import { FilesModule } from '../../../files/files.module';
import { File, FileSchema } from '../../../files/schemas/file.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: List.name, schema: ListSchema },
      { name: Task.name, schema: TaskSchema },
      { name: Space.name, schema: SpaceSchema },
      { name: SpaceParticipant.name, schema: SpaceParticipantSchema },
      { name: File.name, schema: FileSchema },
    ]),
    WorkspaceMembersModule,
    AuthModule,
    WorkspacesModule,
    FilesModule,
  ],
  controllers: [ListController, SpaceListController],
  providers: [ListService],
  exports: [ListService, MongooseModule],
})
export class ListsModule {}
