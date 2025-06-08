import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SpaceParticipantController } from './space-participant.controller';
import { SpaceParticipantService } from './services/space-participant.service';
import {
  SpaceParticipant,
  SpaceParticipantSchema,
} from './schemas/space-participant.schema';
import { WorkspaceMembersModule } from '../../../workspace-members/workspace-members.module';
import { AuthModule } from '../../../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SpaceParticipant.name, schema: SpaceParticipantSchema },
    ]),
    WorkspaceMembersModule,
    AuthModule,
  ],
  controllers: [SpaceParticipantController],
  providers: [SpaceParticipantService],
  exports: [SpaceParticipantService, MongooseModule],
})
export class SpaceParticipantsModule {}
