import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { List, ListDocument } from '../schemas/list.schema';
import { CreateListDto } from '../dto/list.dto';

@Injectable()
export class ListService {
  constructor(
    @InjectModel(List.name)
    private listModel: Model<ListDocument>,
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
}
