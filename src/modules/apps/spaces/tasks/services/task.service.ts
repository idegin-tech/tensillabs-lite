import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Task,
  TaskDocument,
  TaskStatus,
  TaskPriority,
} from '../schemas/task.schema';
import {
  SyncTasksDto,
  UpdateTaskDto,
  GetTasksByListQueryDto,
} from '../dto/task.dto';

export interface GroupedTasks {
  [key: string]: {
    count: number;
    tasks: TaskDocument[];
  };
}

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name)
    private taskModel: Model<TaskDocument>,
  ) {}

  async syncTasks(
    listId: Types.ObjectId,
    syncTasksDto: SyncTasksDto,
    workspaceId: Types.ObjectId,
    currentMemberId: Types.ObjectId,
    space: Types.ObjectId,
  ): Promise<{ created: TaskDocument[]; updated: TaskDocument[] }> {
    const created: TaskDocument[] = [];
    const updated: TaskDocument[] = [];

    for (const taskData of syncTasksDto.tasks) {
      const existingTask = await this.taskModel
        .findOne({
          task_id: taskData.task_id,
          list: listId,
          workspace: workspaceId,
          isDeleted: false,
        })
        .exec();

      if (existingTask) {
        Object.assign(existingTask, {
          name: taskData.name,
          priority: taskData.priority,
          status: taskData.status,
          timeframe: taskData.timeframe,
          assignee:
            taskData.assignee?.map((id) => new Types.ObjectId(id)) || [],
        });

        const savedTask = await existingTask.save();
        updated.push(savedTask);
      } else {
        const newTask = new this.taskModel({
          task_id: taskData.task_id,
          name: taskData.name,
          priority: taskData.priority,
          status: taskData.status,
          timeframe: taskData.timeframe,
          assignee:
            taskData.assignee?.map((id) => new Types.ObjectId(id)) || [],
          list: listId,
          space: space,
          workspace: workspaceId,
          createdBy: currentMemberId,
        });

        const savedTask = await newTask.save();
        created.push(savedTask);
      }
    }

    return { created, updated };
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

    return await task.save();
  }

  async getTasksByList(
    listId: Types.ObjectId,
    workspaceId: Types.ObjectId,
    queryParams: GetTasksByListQueryDto,
    currentMemberId?: Types.ObjectId,
  ): Promise<GroupedTasks> {
    if (queryParams.groupBy === 'status') {
      return this.getTasksGroupedByStatus(
        listId,
        workspaceId,
        queryParams,
        currentMemberId,
      );
    } else if (queryParams.groupBy === 'priority') {
      return this.getTasksGroupedByPriority(
        listId,
        workspaceId,
        queryParams,
        currentMemberId,
      );
    } else {
      return this.getTasksGroupedByDueDate(
        listId,
        workspaceId,
        queryParams,
        currentMemberId,
      );
    }
  }

  async getTasksGroupedByStatus(
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
      status?: string;
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

    for (const status of Object.values(TaskStatus)) {
      const statusFilter = { ...filter, status };
      const tasks = await this.taskModel
        .find(statusFilter as any)
        .populate('assignee', 'firstName lastName primaryEmail')
        .populate('createdBy', 'firstName lastName primaryEmail')
        .sort({ createdAt: -1 })
        .limit(50)
        .exec();

      grouped[status] = {
        count: tasks.length,
        tasks,
      };
    }

    return grouped;
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
}
