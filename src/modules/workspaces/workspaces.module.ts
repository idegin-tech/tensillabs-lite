import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './services/workspace.service';
import { Workspace } from './schemas/workspace.schema';
import { WorkspaceMembersModule } from '../workspace-members/workspace-members.module';
import { AuthModule } from '../auth/auth.module';
import { WalletsModule } from '../billing/wallets/wallets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workspace]),
    forwardRef(() => WorkspaceMembersModule),
    AuthModule,
    forwardRef(() => WalletsModule),
  ],
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
  exports: [WorkspaceService, TypeOrmModule],
})
export class WorkspacesModule {}
