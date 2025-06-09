import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { List, ListDocument } from '../schemas/list.schema';

@Injectable()
export class ListService {
  constructor(
    @InjectModel(List.name)
    private listModel: Model<ListDocument>,
  ) {}

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
