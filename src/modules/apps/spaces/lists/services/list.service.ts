import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { List, ListDocument } from '../schemas/list.schema';
import { CreateListDto } from '../dto/list.dto';
import { Task } from '../../tasks/schemas/task.schema';

@Injectable()
export class ListService {
  constructor(
    @InjectModel(List.name)
    private listModel: Model<ListDocument>,
    @InjectModel(Task.name)
    private taskModel: Model<any>,
  ) {}

  async create(
    createListDto: CreateListDto,
    spaceId: Types.ObjectId,
    workspaceId: Types.ObjectId,
  ): Promise<ListDocument> {
    const list = new this.listModel({
      ...createListDto,
      space: spaceId,
      workspace: workspaceId,
    });

    return await list.save();
  }

  async getListsBySpace(
    spaceId: Types.ObjectId,
    workspaceId: Types.ObjectId,
  ): Promise<ListDocument[]> {
    return await this.listModel
      .find({
        space: spaceId,
        workspace: workspaceId,
        isDeleted: false,
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getListDetails(
    listId: Types.ObjectId,
    workspaceId: Types.ObjectId,
  ): Promise<any> {
    const list = await this.listModel
      .findOne({
        _id: listId,
        workspace: workspaceId,
        isDeleted: false,
      })
      .exec();

    if (!list) {
      throw new NotFoundException('List not found');
    }

    const taskCount = await this.taskModel.countDocuments({
      list: listId,
      workspace: workspaceId,
      isDeleted: false,
    });

    return {
      ...list.toObject(),
      taskCount,
    };
  }
}
