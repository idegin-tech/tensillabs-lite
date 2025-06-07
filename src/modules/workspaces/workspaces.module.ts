import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './services/workspace.service';
import { Workspace, WorkspaceSchema } from './schemas/workspace.schema';
import { WorkspaceMembersModule } from '../workspace-members/workspace-members.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Workspace.name, schema: WorkspaceSchema },
    ]),
    WorkspaceMembersModule,
  ],
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
  exports: [WorkspaceService, MongooseModule],
})
export class WorkspacesModule {}
