import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../schemas/comment.schema';
import { CreateCommentDto, UpdateCommentDto } from '../dto/comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    workspaceId: string,
    createdById: string,
    taskId: string,
    listId: string,
    spaceId: string,
  ): Promise<Comment> {
    const comment = this.commentRepository.create({
      ...createCommentDto,
      workspaceId,
      createdById,
      taskId,
      listId,
      spaceId,
      reactions: [],
    });

    return await this.commentRepository.save(comment);
  }

  async findOne(id: string, workspaceId: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id, workspaceId, isDeleted: false },
      relations: ['createdBy'],
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
    const comment = await this.findOne(id, workspaceId);

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
      where: { taskId, workspaceId, isDeleted: false, parentCommentId: null },
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      comments,
      total,
      page,
      limit,
    };
  }
}
