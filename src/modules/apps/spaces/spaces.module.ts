import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SpaceController } from './space.controller';
import { SpaceService } from './services/space.service';
import { Space, SpaceSchema } from './schemas/space.schema';
import { SpaceParticipantsModule } from './space-participants/space-participants.module';
import { ListsModule } from './lists/lists.module';
import { TasksModule } from './tasks/tasks.module';
import { WorkspaceMembersModule } from '../../workspace-members/workspace-members.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Space.name, schema: SpaceSchema }]),
    SpaceParticipantsModule,
    ListsModule,
    TasksModule,
    WorkspaceMembersModule,
    AuthModule,
  ],
  controllers: [SpaceController],
  providers: [SpaceService],
  exports: [
    SpaceService,
    SpaceParticipantsModule,
    ListsModule,
    TasksModule,
    MongooseModule,
  ],
})
export class SpacesModule {}
