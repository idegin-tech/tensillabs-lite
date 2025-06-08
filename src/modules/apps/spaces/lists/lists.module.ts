import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListController } from './list.controller';
import { ListService } from './services/list.service';
import { List, ListSchema } from './schemas/list.schema';
import { WorkspaceMembersModule } from '../../../workspace-members/workspace-members.module';
import { AuthModule } from '../../../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: List.name, schema: ListSchema }]),
    WorkspaceMembersModule,
    AuthModule,
  ],
  controllers: [ListController],
  providers: [ListService],
  exports: [ListService, MongooseModule],
})
export class ListsModule {}
