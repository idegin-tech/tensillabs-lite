import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamController } from './team.controller';
import { TeamService } from './services/team.service';
import { Team, TeamSchema } from './schemas/team.schema';
import { WorkspaceMembersModule } from '../../workspace-members/workspace-members.module';
import { WorkspacesModule } from '../../workspaces/workspaces.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Team.name, schema: TeamSchema }]),
    WorkspaceMembersModule,
    forwardRef(() => WorkspacesModule),
    AuthModule,
  ],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService, MongooseModule],
})
export class TeamsModule {}
