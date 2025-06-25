/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Checklist, ChecklistDocument } from '../schemas/checklist.schema';
import {
  CreateChecklistDto,
  UpdateChecklistDto,
  GetChecklistsQueryDto,
} from '../dto/checklist.dto';

export interface PaginatedChecklists {
  checklists: ChecklistDocument[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable()
export class ChecklistService {
  constructor(
    @InjectModel(Checklist.name)
    private checklistModel: Model<ChecklistDocument>,
  ) {}

  async createChecklist(
    createChecklistDto: CreateChecklistDto,
    workspaceId: Types.ObjectId,
    currentMemberId: Types.ObjectId,
  ): Promise<ChecklistDocument> {
    const newChecklist = new this.checklistModel({
      name: createChecklistDto.name,
      task: createChecklistDto.task
        ? new Types.ObjectId(createChecklistDto.task)
        : null,
      space: createChecklistDto.space
        ? new Types.ObjectId(createChecklistDto.space)
        : null,
      list: createChecklistDto.list
        ? new Types.ObjectId(createChecklistDto.list)
        : null,
      workspace: workspaceId,
      createdBy: currentMemberId,
      isDone: false,
      isDeleted: false,
    });

    return await newChecklist.save();
  }

  async getAllChecklists(
    queryParams: GetChecklistsQueryDto,
    workspaceId: Types.ObjectId,
  ): Promise<PaginatedChecklists> {
    const filter: any = {
      workspace: workspaceId,
      isDeleted: false,
    };

    // Add optional filters
    if (queryParams.task) {
      filter.task = new Types.ObjectId(queryParams.task);
    }
    if (queryParams.space) {
      filter.space = new Types.ObjectId(queryParams.space);
    }
    if (queryParams.list) {
      filter.list = new Types.ObjectId(queryParams.list);
    }
    if (queryParams.isDone !== undefined) {
      filter.isDone = queryParams.isDone;
    }

    const sortOptions: any = {};
    sortOptions[queryParams.sortBy] = queryParams.sortOrder === 'asc' ? 1 : -1;

    const skip = (queryParams.page - 1) * queryParams.limit;

    const [checklists, total] = await Promise.all([
      this.checklistModel
        .find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(queryParams.limit)
        .populate('task', 'name task_id')
        .populate('space', 'name')
        .populate('list', 'name')
        .populate('createdBy', 'user')
        .exec(),
      this.checklistModel.countDocuments(filter),
    ]);

    return {
      checklists,
      pagination: {
        total,
        page: queryParams.page,
        limit: queryParams.limit,
        totalPages: Math.ceil(total / queryParams.limit),
      },
    };
  }

  async updateChecklist(
    checklistId: Types.ObjectId,
    updateChecklistDto: UpdateChecklistDto,
    workspaceId: Types.ObjectId,
  ): Promise<ChecklistDocument> {
    const checklist = await this.checklistModel.findOne({
      _id: checklistId,
      workspace: workspaceId,
      isDeleted: false,
    });

    if (!checklist) {
      throw new NotFoundException('Checklist not found');
    }

    // Only allow updating name and isDone
    const updateData: any = {};
    if (updateChecklistDto.name !== undefined) {
      updateData.name = updateChecklistDto.name;
    }
    if (updateChecklistDto.isDone !== undefined) {
      updateData.isDone = updateChecklistDto.isDone;
    }

    const updatedChecklist = await this.checklistModel
      .findByIdAndUpdate(checklistId, updateData, {
        new: true,
        runValidators: true,
      })
      .populate('task', 'name task_id')
      .populate('space', 'name')
      .populate('list', 'name')
      .populate('createdBy', 'user');

    return updatedChecklist;
  }

  async deleteChecklist(
    checklistId: Types.ObjectId,
    workspaceId: Types.ObjectId,
  ): Promise<ChecklistDocument> {
    const checklist = await this.checklistModel.findOne({
      _id: checklistId,
      workspace: workspaceId,
      isDeleted: false,
    });

    if (!checklist) {
      throw new NotFoundException('Checklist not found');
    }

    // Soft delete
    const deletedChecklist = await this.checklistModel.findByIdAndUpdate(
      checklistId,
      { isDeleted: true },
      { new: true },
    );

    return deletedChecklist;
  }

  async getChecklistsByTask(
    taskId: Types.ObjectId,
    workspaceId: Types.ObjectId,
  ): Promise<ChecklistDocument[]> {
    return this.checklistModel
      .find({
        task: taskId,
        workspace: workspaceId,
        isDeleted: false,
      })
      .sort({ createdAt: 1 })
      .populate('createdBy', 'user')
      .exec();
  }
}
