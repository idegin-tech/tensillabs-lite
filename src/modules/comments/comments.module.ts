import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './schemas/comment.schema';
import { CommentService } from './services/comment.service';
import { CommentsController } from './comments.controller';
import { FilesModule } from '../files/files.module';
import { WorkspaceMembersModule } from '../workspace-members/workspace-members.module';
import { AuthModule } from '../auth/auth.module';
import { WorkspacesModule } from '../workspaces/workspaces.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    FilesModule,
    WorkspaceMembersModule,
    AuthModule,
    WorkspacesModule,
  ],
  controllers: [CommentsController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentsModule {}
