import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceController } from './space.controller';
import { SpaceService } from './services/space.service';
import { Space } from './schemas/space.schema';
import { List } from './lists/schemas/list.schema';
import { SpaceParticipant } from './space-participants/schemas/space-participant.schema';
import { SpaceParticipantsModule } from './space-participants/space-participants.module';
import { ListsModule } from './lists/lists.module';
import { TasksModule } from './tasks/tasks.module';
import { WorkspaceMembersModule } from '../../workspace-members/workspace-members.module';
import { AuthModule } from '../../auth/auth.module';
import { WorkspacesModule } from '../../workspaces/workspaces.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Space, List, SpaceParticipant]),
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
    TypeOrmModule,
  ],
})
export class SpacesModule {}
