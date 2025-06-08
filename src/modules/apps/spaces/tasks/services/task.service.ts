import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument, TaskStatus } from '../schemas/task.schema';
import { CreateTaskDto } from '../dto/task.dto';
import {
  SpaceParticipant,
  SpaceParticipantDocument,
  ParticipantStatus,
} from '../../space-participants/schemas/space-participant.schema';
import { List, ListDocument } from '../../lists/schemas/list.schema';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name)
    private taskModel: Model<TaskDocument>,
    @InjectModel(SpaceParticipant.name)
    private spaceParticipantModel: Model<SpaceParticipantDocument>,
    @InjectModel(List.name)
    private listModel: Model<ListDocument>,
  ) {}

  async create(
    listId: Types.ObjectId,
    createTaskDto: CreateTaskDto,
    workspaceId: Types.ObjectId,
    currentMemberId: Types.ObjectId,
  ): Promise<TaskDocument> {
    const list = await this.listModel.findById(listId).exec();
    if (!list) {
      throw new NotFoundException('List not found');
    }

    await this.verifySpaceParticipation(
      list.space,
      currentMemberId,
      workspaceId,
    );

    const task = new this.taskModel({
      ...createTaskDto,
      list: listId,
      space: list.space,
      workspace: workspaceId,
      createdBy: currentMemberId,
      status: TaskStatus.TODO,
    });

    return await task.save();
  }

  async getTasksByList(
    listId: Types.ObjectId,
    workspaceId: Types.ObjectId,
    currentMemberId: Types.ObjectId,
  ): Promise<TaskDocument[]> {
    const list = await this.listModel.findById(listId).exec();
    if (!list) {
      throw new NotFoundException('List not found');
    }

    await this.verifySpaceParticipation(
      list.space,
      currentMemberId,
      workspaceId,
    );

    return await this.taskModel
      .find({
        list: listId,
        workspace: workspaceId,
        isDeleted: false,
      })
      .populate('assignee', 'member role')
      .populate('createdBy', 'firstName lastName primaryEmail')
      .sort({ createdAt: -1 })
      .exec();
  }

  private async verifySpaceParticipation(
    spaceId: Types.ObjectId,
    memberId: Types.ObjectId,
    workspaceId: Types.ObjectId,
  ): Promise<void> {
    const participant = await this.spaceParticipantModel
      .findOne({
        space: spaceId,
        member: memberId,
        workspace: workspaceId,
        status: ParticipantStatus.ACTIVE,
      })
      .exec();

    if (!participant) {
      throw new ForbiddenException(
        'Access denied: Not a participant of this space',
      );
    }
  }
}
