import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, PaginateModel } from 'mongoose';
import { List, ListDocument } from '../schemas/list.schema';
import { CreateListDto } from '../dto/list.dto';
import { Task } from '../../tasks/schemas/task.schema';
import { File, FileDocument } from '../../../../files/schemas/file.schema';
import { GetListFilesQueryDto } from '../dto/list-files.dto';

@Injectable()
export class ListService {
  constructor(
    @InjectModel(List.name)
    private listModel: Model<ListDocument>,
    @InjectModel(Task.name)
    private taskModel: Model<any>,
    @InjectModel(File.name)
    private fileModel: Model<FileDocument> & PaginateModel<FileDocument>,
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

  async getListFiles(
    listId: Types.ObjectId,
    workspaceId: Types.ObjectId,
    queryParams: GetListFilesQueryDto,
  ): Promise<{
    files: FileDocument[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const list = await this.listModel.findOne({
      _id: listId,
      workspace: workspaceId,
      isDeleted: false,
    });

    if (!list) {
      throw new NotFoundException('List not found');
    }

    const tasks = await this.taskModel
      .find({
        list: listId,
        workspace: workspaceId,
        isDeleted: false,
      })
      .select('_id')
      .lean();

    const taskIds = tasks.map((task) => task._id);

    const query: Record<string, any> = {
      task: { $in: taskIds },
      workspace: workspaceId,
      isDeleted: false,
      isActive: true,
    };

    if (queryParams.search) {
      query.$or = [
        { name: { $regex: queryParams.search, $options: 'i' } },
        { description: { $regex: queryParams.search, $options: 'i' } },
      ];
    }

    if (queryParams.mimeType) {
      query.mimeType = { $regex: queryParams.mimeType, $options: 'i' };
    }

    const sortField = queryParams.sortBy || 'createdAt';
    const sortOrder = queryParams.sortOrder === 'asc' ? 1 : -1;
    const sort: Record<string, 1 | -1> = { [sortField]: sortOrder };

    const totalCount = await this.fileModel.countDocuments(query);
    const totalPages = Math.ceil(totalCount / queryParams.limit);

    const files = await this.fileModel
      .find(query)
      .sort(sort)
      .skip((queryParams.page - 1) * queryParams.limit)
      .limit(queryParams.limit)
      .populate('createdBy', 'firstName lastName email')
      .exec();

    return {
      files,
      totalCount,
      page: queryParams.page,
      limit: queryParams.limit,
      totalPages,
    };
  }
}

