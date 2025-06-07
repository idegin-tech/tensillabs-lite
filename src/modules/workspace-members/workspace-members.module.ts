import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkspaceMemberService } from './services/workspace-member.service';
import { WorkspaceMemberController } from './workspace-member.controller';
import { WorkspaceMemberGuard } from './guards/workspace-member.guard';
import {
  WorkspaceMember,
  WorkspaceMemberSchema,
} from './schemas/workspace-member.schema';
import { WorkspacesModule } from '../workspaces/workspaces.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WorkspaceMember.name, schema: WorkspaceMemberSchema },
    ]),
    forwardRef(() => WorkspacesModule),
  ],
  controllers: [WorkspaceMemberController],
  providers: [WorkspaceMemberService, WorkspaceMemberGuard],
  exports: [MongooseModule, WorkspaceMemberService],
})
export class WorkspaceMembersModule {}
