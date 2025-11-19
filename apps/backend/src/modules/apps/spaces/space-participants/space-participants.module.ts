import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceParticipantController } from './space-participant.controller';
import { SpaceParticipantService } from './services/space-participant.service';
import { SpaceParticipant } from './schemas/space-participant.schema';
import { Space } from '../schemas/space.schema';
import { List } from '../lists/schemas/list.schema';
import { WorkspaceMembersModule } from '../../../workspace-members/workspace-members.module';
import { AuthModule } from '../../../auth/auth.module';
import { WorkspacesModule } from '../../../workspaces/workspaces.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SpaceParticipant, Space, List]),
    WorkspaceMembersModule,
    AuthModule,
    WorkspacesModule,
  ],
  controllers: [SpaceParticipantController],
  providers: [SpaceParticipantService],
  exports: [SpaceParticipantService, TypeOrmModule],
})
export class SpaceParticipantsModule {}
