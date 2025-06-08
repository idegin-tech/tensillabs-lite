import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './services/workspace.service';
import { Workspace, WorkspaceSchema } from './schemas/workspace.schema';
import { WorkspaceMembersModule } from '../workspace-members/workspace-members.module';
import { AuthModule } from '../auth/auth.module';
import { WalletsModule } from '../billing/wallets/wallets.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Workspace.name, schema: WorkspaceSchema },
    ]),
    forwardRef(() => WorkspaceMembersModule),
    AuthModule,
    forwardRef(() => WalletsModule),
  ],
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
  exports: [WorkspaceService, MongooseModule],
})
export class WorkspacesModule {}
