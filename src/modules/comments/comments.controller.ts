import {
  Controller,
  Put,
  Delete,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { CommentService } from './services/comment.service';
import { FileService } from '../files/services/file.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { WorkspaceMemberGuard } from '../workspace-members/guards/workspace-member.guard';
import { createSuccessResponse } from '../../lib/response.interface';
import { ZodValidationPipe } from '../../lib/validation.pipe';
import {
  updateCommentSchema,
  UpdateCommentDto,
  addReactionSchema,
  AddReactionDto,
} from './dto/comment.dto';

@Controller('comments')
@UseGuards(AuthGuard, WorkspaceMemberGuard)
export class CommentsController {
  constructor(
    private readonly commentService: CommentService,
    private readonly fileService: FileService,
  ) {}

  @Put(':commentId')
  async updateComment(
    @Param('commentId') commentId: string,
    @Body(new ZodValidationPipe(updateCommentSchema))
    updateCommentDto: UpdateCommentDto,
    @Req()
    req: Request & {
      workspaceMember: any;
      workspace: any;
    },
  ) {
    const comment = await this.commentService.findOne(
      commentId,
      req.workspace.id,
    );

    if (comment.createdById !== req.workspaceMember.id) {
      throw new NotFoundException('You can only edit your own comments');
    }

    const updatedComment = await this.commentService.update(
      commentId,
      updateCommentDto,
      req.workspace.id,
    );

    return createSuccessResponse('Comment updated successfully', updatedComment);
  }

  @Delete(':commentId')
  async deleteComment(
    @Param('commentId') commentId: string,
    @Req()
    req: Request & {
      workspaceMember: any;
      workspace: any;
    },
  ) {
    const comment = await this.commentService.findOne(
      commentId,
      req.workspace.id,
    );

    if (comment.createdById !== req.workspaceMember.id) {
      throw new NotFoundException('You can only delete your own comments');
    }

    await this.fileService.deleteByCommentId(commentId, req.workspace.id);

    const deletedComment = await this.commentService.delete(
      commentId,
      req.workspace.id,
    );

    return createSuccessResponse('Comment deleted successfully', deletedComment);
  }

  @Post(':commentId/reactions')
  async addReaction(
    @Param('commentId') commentId: string,
    @Body(new ZodValidationPipe(addReactionSchema))
    addReactionDto: AddReactionDto,
    @Req()
    req: Request & {
      workspaceMember: any;
      workspace: any;
    },
  ) {
    const comment = await this.commentService.addReaction(
      commentId,
      addReactionDto.emoji,
      req.workspaceMember.id,
      req.workspace.id,
    );

    return createSuccessResponse('Reaction added successfully', comment);
  }

  @Delete(':commentId/reactions')
  async removeReaction(
    @Param('commentId') commentId: string,
    @Body(new ZodValidationPipe(addReactionSchema))
    addReactionDto: AddReactionDto,
    @Req()
    req: Request & {
      workspaceMember: any;
      workspace: any;
    },
  ) {
    const comment = await this.commentService.removeReaction(
      commentId,
      addReactionDto.emoji,
      req.workspaceMember.id,
      req.workspace.id,
    );

    return createSuccessResponse('Reaction removed successfully', comment);
  }
}
