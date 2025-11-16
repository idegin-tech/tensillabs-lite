import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Comment } from '../schemas/comment.schema';
import { CreateCommentDto, UpdateCommentDto } from '../dto/comment.dto';
import { WorkspaceMember } from '../../workspace-members/schemas/workspace-member.schema';
import { FileService } from '../../files/services/file.service';
import { UploadService } from '../../../lib/upload.lib';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(WorkspaceMember)
    private readonly workspaceMemberRepository: Repository<WorkspaceMember>,
    private readonly fileService: FileService,
    private readonly uploadService: UploadService,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    workspaceId: string,
    createdById: string,
    taskId: string,
    listId: string,
    spaceId: string,
    leaveRequestId?: string,
  ): Promise<Comment> {
    const comment = this.commentRepository.create({
      ...createCommentDto,
      workspaceId,
      createdById,
      taskId,
      listId,
      spaceId,
      leaveRequestId,
      reactions: [],
    });

    return await this.commentRepository.save(comment);
  }

  async findOne(id: string, workspaceId: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id, workspaceId, isDeleted: false },
      relations: ['createdBy', 'files'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
    workspaceId: string,
  ): Promise<Comment> {
    const comment = await this.findOne(id, workspaceId);

    Object.assign(comment, updateCommentDto);

    return await this.commentRepository.save(comment);
  }

  async delete(id: string, workspaceId: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id, workspaceId, isDeleted: false },
      relations: ['files'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.files && comment.files.length > 0) {
      for (const file of comment.files) {
        if (file.fileKey) {
          try {
            await this.uploadService.deleteFile(file.fileKey);
          } catch (error) {
            console.error(`Failed to delete file from storage: ${file.fileKey}`, error);
          }
        }
        
        await this.fileService.delete(file.id, workspaceId);
      }
    }

    comment.isDeleted = true;

    return await this.commentRepository.save(comment);
  }

  async addReaction(
    id: string,
    emoji: string,
    memberId: string,
    workspaceId: string,
  ): Promise<Comment> {
    const comment = await this.findOne(id, workspaceId);

    const reactions = comment.reactions || [];
    const existingReactionIndex = reactions.findIndex(
      (r) => r.emoji === emoji,
    );

    if (existingReactionIndex > -1) {
      const memberIds = reactions[existingReactionIndex].memberIds;
      if (!memberIds.includes(memberId)) {
        memberIds.push(memberId);
      }
    } else {
      reactions.push({
        emoji,
        memberIds: [memberId],
      });
    }

    comment.reactions = reactions;

    return await this.commentRepository.save(comment);
  }

  async removeReaction(
    id: string,
    emoji: string,
    memberId: string,
    workspaceId: string,
  ): Promise<Comment> {
    const comment = await this.findOne(id, workspaceId);

    const reactions = comment.reactions || [];
    const existingReactionIndex = reactions.findIndex(
      (r) => r.emoji === emoji,
    );

    if (existingReactionIndex > -1) {
      const memberIds = reactions[existingReactionIndex].memberIds;
      const memberIndex = memberIds.indexOf(memberId);

      if (memberIndex > -1) {
        memberIds.splice(memberIndex, 1);
      }

      if (memberIds.length === 0) {
        reactions.splice(existingReactionIndex, 1);
      }
    }

    comment.reactions = reactions;

    return await this.commentRepository.save(comment);
  }

  async getTaskComments(
    taskId: string,
    workspaceId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ comments: Comment[]; total: number; page: number; limit: number }> {
    const [comments, total] = await this.commentRepository.findAndCount({
      where: { taskId, workspaceId, parentCommentId: null },
      relations: ['createdBy', 'files', 'quotedComment', 'quotedComment.createdBy'],
      order: { createdAt: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const allMentionedMemberIds = new Set<string>();
    comments.forEach(comment => {
      if (comment.mentionedMemberIds && comment.mentionedMemberIds.length > 0) {
        comment.mentionedMemberIds.forEach(id => allMentionedMemberIds.add(id));
      }
    });

    let mentionedMembersMap = new Map<string, WorkspaceMember>();
    if (allMentionedMemberIds.size > 0) {
      const mentionedMembers = await this.workspaceMemberRepository.find({
        where: {
          id: In(Array.from(allMentionedMemberIds)),
          workspaceId,
        },
      });
      mentionedMembers.forEach(member => {
        mentionedMembersMap.set(member.id, member);
      });
    }

    const commentsWithMembers = comments.map(comment => {
      if (comment.mentionedMemberIds && comment.mentionedMemberIds.length > 0) {
        (comment as any).mentionedMembers = comment.mentionedMemberIds
          .map(id => mentionedMembersMap.get(id))
          .filter(member => member !== undefined);
      }
      return comment;
    });

    return {
      comments: commentsWithMembers,
      total,
      page,
      limit,
    };
  }

  async getLeaveRequestComments(
    leaveRequestId: string,
    workspaceId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ comments: Comment[]; total: number; page: number; limit: number }> {
    const [comments, total] = await this.commentRepository.findAndCount({
      where: { leaveRequestId, workspaceId, parentCommentId: null },
      relations: ['createdBy', 'files', 'quotedComment', 'quotedComment.createdBy'],
      order: { createdAt: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const allMentionedMemberIds = new Set<string>();
    comments.forEach(comment => {
      if (comment.mentionedMemberIds && comment.mentionedMemberIds.length > 0) {
        comment.mentionedMemberIds.forEach(id => allMentionedMemberIds.add(id));
      }
    });

    let mentionedMembersMap = new Map<string, WorkspaceMember>();
    if (allMentionedMemberIds.size > 0) {
      const mentionedMembers = await this.workspaceMemberRepository.find({
        where: {
          id: In(Array.from(allMentionedMemberIds)),
          workspaceId,
        },
      });
      mentionedMembers.forEach(member => {
        mentionedMembersMap.set(member.id, member);
      });
    }

    const commentsWithMembers = comments.map(comment => {
      if (comment.mentionedMemberIds && comment.mentionedMemberIds.length > 0) {
        (comment as any).mentionedMembers = comment.mentionedMemberIds
          .map(id => mentionedMembersMap.get(id))
          .filter(member => member !== undefined);
      }
      return comment;
    });

    return {
      comments: commentsWithMembers,
      total,
      page,
      limit,
    };
  }
}
