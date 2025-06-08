import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamController } from './team.controller';
import { TeamService } from './services/team.service';
import { Team, TeamSchema } from './schemas/team.schema';
import { WorkspaceMembersModule } from '../../workspace-members/workspace-members.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Team.name, schema: TeamSchema }]),
    WorkspaceMembersModule,
  ],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService, MongooseModule],
})
export class TeamsModule {}
