import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkspaceMemberService } from './services/workspace-member.service';
import {
  WorkspaceMember,
  WorkspaceMemberSchema,
} from './schemas/workspace-member.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WorkspaceMember.name, schema: WorkspaceMemberSchema },
    ]),
  ],
  providers: [WorkspaceMemberService],
  exports: [MongooseModule, WorkspaceMemberService],
})
export class WorkspaceMembersModule {}
