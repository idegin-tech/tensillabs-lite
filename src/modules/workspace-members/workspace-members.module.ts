import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reflector } from '@nestjs/core';
import { WorkspaceMemberService } from './services/workspace-member.service';
import { WorkspaceMemberController } from './workspace-member.controller';
import { WorkspaceMemberGuard } from './guards/workspace-member.guard';
import {
  WorkspaceMember,
  WorkspaceMemberSchema,
} from './schemas/workspace-member.schema';
import { WorkspacesModule } from '../workspaces/workspaces.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WorkspaceMember.name, schema: WorkspaceMemberSchema },
    ]),
    forwardRef(() => WorkspacesModule),
    AuthModule,
  ],
  controllers: [WorkspaceMemberController],
  providers: [WorkspaceMemberService, WorkspaceMemberGuard, Reflector],
  exports: [MongooseModule, WorkspaceMemberService, WorkspaceMemberGuard],
})
export class WorkspaceMembersModule {}
