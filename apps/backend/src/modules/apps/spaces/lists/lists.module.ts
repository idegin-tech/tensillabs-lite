import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListController, SpaceListController } from './list.controller';
import { ListService } from './services/list.service';
import { List } from './schemas/list.schema';
import { Task } from '../tasks/schemas/task.schema';
import { Space } from '../schemas/space.schema';
import { SpaceParticipant } from '../space-participants/schemas/space-participant.schema';
import { WorkspaceMembersModule } from '../../../workspace-members/workspace-members.module';
import { AuthModule } from '../../../auth/auth.module';
import { WorkspacesModule } from '../../../workspaces/workspaces.module';
import { FilesModule } from '../../../files/files.module';
import { File } from '../../../files/schemas/file.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([List, Task, Space, SpaceParticipant, File]),
    WorkspaceMembersModule,
    AuthModule,
    WorkspacesModule,
    FilesModule,
  ],
  controllers: [ListController, SpaceListController],
  providers: [ListService],
  exports: [ListService, TypeOrmModule],
})
export class ListsModule {}
