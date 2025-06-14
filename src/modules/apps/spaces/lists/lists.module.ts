import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListController } from './list.controller';
import { ListService } from './services/list.service';
import { List, ListSchema } from './schemas/list.schema';
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
      { name: List.name, schema: ListSchema },
      { name: Space.name, schema: SpaceSchema },
      { name: SpaceParticipant.name, schema: SpaceParticipantSchema },
    ]),
    WorkspaceMembersModule,
    AuthModule,
    WorkspacesModule,
  ],
  controllers: [ListController],
  providers: [ListService],
  exports: [ListService, MongooseModule],
})
export class ListsModule {}
