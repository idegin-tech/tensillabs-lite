import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamController } from './team.controller';
import { TeamService } from './services/team.service';
import { Team } from './schemas/team.schema';
import { WorkspaceMembersModule } from '../../workspace-members/workspace-members.module';
import { WorkspacesModule } from '../../workspaces/workspaces.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Team]),
    WorkspaceMembersModule,
    forwardRef(() => WorkspacesModule),
    AuthModule,
  ],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService, TypeOrmModule],
})
export class TeamsModule {}
