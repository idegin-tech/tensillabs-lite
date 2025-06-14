import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SpaceController } from './space.controller';
import { SpaceService } from './services/space.service';
import { Space, SpaceSchema } from './schemas/space.schema';
import { List, ListSchema } from './lists/schemas/list.schema';
import {
  SpaceParticipant,
  SpaceParticipantSchema,
} from './space-participants/schemas/space-participant.schema';
import { SpaceParticipantsModule } from './space-participants/space-participants.module';
import { ListsModule } from './lists/lists.module';
import { TasksModule } from './tasks/tasks.module';
import { WorkspaceMembersModule } from '../../workspace-members/workspace-members.module';
import { AuthModule } from '../../auth/auth.module';
import { WorkspacesModule } from '../../workspaces/workspaces.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Space.name, schema: SpaceSchema },
      { name: List.name, schema: ListSchema },
      { name: SpaceParticipant.name, schema: SpaceParticipantSchema },
    ]),
    SpaceParticipantsModule,
    ListsModule,
    TasksModule,
    WorkspaceMembersModule,
    AuthModule,
    WorkspacesModule,
  ],
  controllers: [SpaceController],
  providers: [SpaceService],
  exports: [
    SpaceService,
    SpaceParticipantsModule,
    ListsModule,
    TasksModule,
    MongooseModule,
  ],
})
export class SpacesModule {}
