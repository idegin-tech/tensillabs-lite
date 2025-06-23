/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument, TaskPriority } from '../schemas/task.schema';
import {
  UpdateTaskDto,
  CreateTasksDto,
  GetTasksByGroupQueryDto,
  GetTasksByListQueryDto,
} from '../dto/task.dto';
import { ChecklistService } from '../../../checklists/services/checklist.service';

export interface GroupedTasks {
  [key: string]: {
    count: number;
    tasks: TaskDocument[];
  };
}

export interface TaskDetailsResponse {
  task: TaskDocument;
  checklist: any[];
}

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name)
    private taskModel: Model<TaskDocument>,
    private checklistService: ChecklistService,
  ) {}

  async createTasks(
    listId: Types.ObjectId,
    createTasksDto: CreateTasksDto,
    workspaceId: Types.ObjectId,
    currentMemberId: Types.ObjectId,
    space: Types.ObjectId,
  ): Promise<TaskDocument[]> {
    const createdTasks: TaskDocument[] = [];

    for (const taskData of createTasksDto.tasks) {
      const newTask = new this.taskModel({
        task_id: `TASK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: taskData.name,
        description: taskData.description,
        priority: taskData.priority,
        status: taskData.status,
        timeframe: taskData.timeframe,
        assignee: [],
        list: listId,
        space: space,
        workspace: workspaceId,
        createdBy: currentMemberId,
      });

      const savedTask = await newTask.save();
      createdTasks.push(savedTask);
    }

    return createdTasks;
  }

  async updateTask(
    listId: Types.ObjectId,
    taskId: Types.ObjectId,
    updateTaskDto: UpdateTaskDto,
    workspaceId: Types.ObjectId,
  ): Promise<TaskDocument> {
    const task = await this.taskModel
      .findOne({
        _id: taskId,
        list: listId,
        workspace: workspaceId,
        isDeleted: false,
      })
      .exec();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (updateTaskDto.name !== undefined) {
      task.name = updateTaskDto.name;
    }

    if (updateTaskDto.description !== undefined) {
      task.description = updateTaskDto.description;
    }

    if (updateTaskDto.status !== undefined) {
      task.status = updateTaskDto.status;
    }

    if (updateTaskDto.priority !== undefined) {
      task.priority = updateTaskDto.priority;
    }

    if (updateTaskDto.timeframe !== undefined) {
      task.timeframe = updateTaskDto.timeframe;
    }

    if (updateTaskDto.assignee !== undefined) {
      task.assignee = updateTaskDto.assignee.map(
        (id) => new Types.ObjectId(id),
      );
    }

    return await task.save();
  }

  async getAllTasksByGroup(
    listId: Types.ObjectId,
    workspaceId: Types.ObjectId,
    queryParams: GetTasksByGroupQueryDto,
    currentMemberId?: Types.ObjectId,
  ): Promise<{ tasks: TaskDocument[]; totalCount: number; hasMore: boolean }> {
    interface TaskFilter {
      list: Types.ObjectId;
      workspace: Types.ObjectId;
      isDeleted: boolean;
      assignee?: Types.ObjectId;
      status?: string;
      priority?: string;
      'timeframe.end'?: any;
      $or?: any[];
    }

    const filter: TaskFilter = {
      list: listId,
      workspace: workspaceId,
      isDeleted: false,
    };

    if (queryParams.meMode && currentMemberId) {
      filter.assignee = currentMemberId;
    }

    if (queryParams.status) {
      filter.status = queryParams.status;
    }

    if (queryParams.priority) {
      if (queryParams.priority === 'none') {
        filter.$or = [{ priority: null }, { priority: { $exists: false } }];
      } else {
        filter.priority = queryParams.priority;
      }
    }

    if (queryParams.due_status) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

      switch (queryParams.due_status) {
        case 'overdue':
          filter['timeframe.end'] = { $lt: today };
          break;
        case 'today':
          filter['timeframe.end'] = { $gte: today, $lt: tomorrow };
          break;
        case 'tomorrow':
          filter['timeframe.end'] = {
            $gte: tomorrow,
            $lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000),
          };
          break;
        case 'this_week':
          filter['timeframe.end'] = {
            $gte: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000),
            $lte: endOfWeek,
          };
          break;
        case 'later':
          filter['timeframe.end'] = { $gt: endOfWeek };
          break;
        case 'none':
          filter.$or = [
            { 'timeframe.end': null },
            { 'timeframe.end': { $exists: false } },
            { timeframe: null },
            { timeframe: { $exists: false } },
          ];
          break;
      }
    }

    const skip = (queryParams.page - 1) * queryParams.limit;
    const totalCount = await this.taskModel.countDocuments(filter as any);

    const tasks = await this.taskModel
      .find(filter as any)
      .populate('assignee', 'firstName lastName primaryEmail avatarURL')
      .populate('createdBy', 'firstName lastName primaryEmail avatarURL')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(queryParams.limit)
      .exec();

    const hasMore = skip + tasks.length < totalCount;

    return {
      tasks,
      totalCount,
      hasMore,
    };
  }

  async getTasksGroupedByPriority(
    listId: Types.ObjectId,
    workspaceId: Types.ObjectId,
    queryParams: GetTasksByListQueryDto,
    currentMemberId?: Types.ObjectId,
  ): Promise<GroupedTasks> {
    interface TaskFilter {
      list: Types.ObjectId;
      workspace: Types.ObjectId;
      isDeleted: boolean;
      assignee?: Types.ObjectId;
      priority?: string;
      $or?: any[];
      'timeframe.end'?: {
        $gte: Date;
        $lt: Date;
      };
    }

    const filter: TaskFilter = {
      list: listId,
      workspace: workspaceId,
      isDeleted: false,
    };

    if (queryParams.meMode && currentMemberId) {
      filter.assignee = currentMemberId;
    }

    if (queryParams.dueDate) {
      filter['timeframe.end'] = {
        $gte: new Date(queryParams.dueDate.setHours(0, 0, 0, 0)),
        $lt: new Date(queryParams.dueDate.setHours(23, 59, 59, 999)),
      };
    }

    const grouped: GroupedTasks = {};

    const priorities = [...Object.values(TaskPriority), 'unassigned'];

    for (const priority of priorities) {
      let priorityFilter: TaskFilter;
      if (priority === 'unassigned') {
        priorityFilter = {
          ...filter,
          $or: [{ priority: null }, { priority: { $exists: false } }],
        };
      } else {
        priorityFilter = { ...filter, priority };
      }

      const tasks = await this.taskModel
        .find(priorityFilter as any)
        .populate('assignee', 'firstName lastName primaryEmail')
        .populate('createdBy', 'firstName lastName primaryEmail')
        .sort({ createdAt: -1 })
        .limit(50)
        .exec();

      grouped[priority] = {
        count: tasks.length,
        tasks,
      };
    }

    return grouped;
  }

  async getTasksGroupedByDueDate(
    listId: Types.ObjectId,
    workspaceId: Types.ObjectId,
    queryParams: GetTasksByListQueryDto,
    currentMemberId?: Types.ObjectId,
  ): Promise<GroupedTasks> {
    interface TaskFilter {
      list: Types.ObjectId;
      workspace: Types.ObjectId;
      isDeleted: boolean;
      assignee?: Types.ObjectId;
      'timeframe.end'?: any;
      $or?: any[];
      timeframe?: any;
    }

    const baseFilter: TaskFilter = {
      list: listId,
      workspace: workspaceId,
      isDeleted: false,
    };

    if (queryParams.meMode && currentMemberId) {
      baseFilter.assignee = currentMemberId;
    }

    const grouped: GroupedTasks = {};
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay())); // End of current week (Saturday)

    const dueStatusFilters: Record<string, TaskFilter> = {
      overdue: {
        ...baseFilter,
        'timeframe.end': { $lt: today },
      },
      today: {
        ...baseFilter,
        'timeframe.end': {
          $gte: today,
          $lt: tomorrow,
        },
      },
      tomorrow: {
        ...baseFilter,
        'timeframe.end': {
          $gte: tomorrow,
          $lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      this_week: {
        ...baseFilter,
        'timeframe.end': {
          $gte: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000),
          $lte: endOfWeek,
        },
      },
      later: {
        ...baseFilter,
        'timeframe.end': { $gt: endOfWeek },
      },
      none: {
        ...baseFilter,
        $or: [
          { 'timeframe.end': null },
          { 'timeframe.end': { $exists: false } },
          { timeframe: null },
          { timeframe: { $exists: false } },
        ],
      },
    };

    for (const [dueStatus, filter] of Object.entries(dueStatusFilters)) {
      const tasks = await this.taskModel
        .find(filter as any)
        .populate('assignee', 'firstName lastName primaryEmail')
        .populate('createdBy', 'firstName lastName primaryEmail')
        .sort({ 'timeframe.end': 1, createdAt: -1 })
        .limit(50)
        .exec();

      grouped[dueStatus] = {
        count: tasks.length,
        tasks,
      };
    }

    return grouped;
  }

  async deleteTask(
    listId: Types.ObjectId,
    taskId: Types.ObjectId,
    workspaceId: Types.ObjectId,
  ): Promise<TaskDocument> {
    const task = await this.taskModel
      .findOne({
        _id: taskId,
        list: listId,
        workspace: workspaceId,
        isDeleted: false,
      })
      .exec();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    task.isDeleted = true;
    return await task.save();
  }

  async getTaskDetails(
    listId: Types.ObjectId,
    taskId: Types.ObjectId,
    workspaceId: Types.ObjectId,
  ): Promise<TaskDetailsResponse> {
    const task = await this.taskModel
      .findOne({
        _id: taskId,
        list: listId,
        workspace: workspaceId,
        isDeleted: false,
      })
      .populate('assignee', 'firstName lastName primaryEmail avatarURL')
      .populate('createdBy', 'firstName lastName primaryEmail avatarURL')
      .exec();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const checklist = await this.checklistService.getChecklistsByTask(
      taskId,
      workspaceId,
    );

    return {
      task,
      checklist,
    };
  }
}
