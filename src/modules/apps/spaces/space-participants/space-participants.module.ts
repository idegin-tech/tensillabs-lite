import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SpaceParticipantController } from './space-participant.controller';
import { SpaceParticipantService } from './services/space-participant.service';
import {
  SpaceParticipant,
  SpaceParticipantSchema,
} from './schemas/space-participant.schema';
import { Space, SpaceSchema } from '../schemas/space.schema';
import { List, ListSchema } from '../lists/schemas/list.schema';
import { WorkspaceMembersModule } from '../../../workspace-members/workspace-members.module';
import { AuthModule } from '../../../auth/auth.module';
import { WorkspacesModule } from '../../../workspaces/workspaces.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SpaceParticipant.name, schema: SpaceParticipantSchema },
      { name: Space.name, schema: SpaceSchema },
      { name: List.name, schema: ListSchema },
    ]),
    WorkspaceMembersModule,
    AuthModule,
    WorkspacesModule,
  ],
  controllers: [SpaceParticipantController],
  providers: [SpaceParticipantService],
  exports: [SpaceParticipantService, MongooseModule],
})
export class SpaceParticipantsModule {}
