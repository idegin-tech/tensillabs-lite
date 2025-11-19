import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reflector } from '@nestjs/core';
import { WorkspaceMemberService } from './services/workspace-member.service';
import { WorkspaceMemberController } from './workspace-member.controller';
import { WorkspaceMemberGuard } from './guards/workspace-member.guard';
import { WorkspaceMember } from './schemas/workspace-member.schema';
import { WorkspaceMemberSecrets } from './schemas/workspace-member-secrets.schema';
import { WorkspacesModule } from '../workspaces/workspaces.module';
import { AuthModule } from '../auth/auth.module';
import { User } from '../users/schemas/user.schema';
import { UserSecrets } from '../users/schemas/user-secrets.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkspaceMember, WorkspaceMemberSecrets, User, UserSecrets]),
    forwardRef(() => WorkspacesModule),
    AuthModule,
  ],
  controllers: [WorkspaceMemberController],
  providers: [WorkspaceMemberService, WorkspaceMemberGuard, Reflector],
  exports: [TypeOrmModule, WorkspaceMemberService, WorkspaceMemberGuard],
})
export class WorkspaceMembersModule {}
