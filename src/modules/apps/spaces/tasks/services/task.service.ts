import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskPriority } from '../schemas/task.schema';
import {
  UpdateTaskDto,
  CreateTasksDto,
  GetTasksByGroupQueryDto,
  GetTasksByListQueryDto,
} from '../dto/task.dto';
import { ChecklistService } from 'src/modules/checklists/services/checklist.service';
import { FileService } from 'src/modules/files/services/file.service';

export interface GroupedTasks {
  [key: string]: {
    count: number;
    tasks: Task[];
  };
}

export interface TaskDetailsResponse {
  task: Task;
  checklist: any[];
  files: any[];
}

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private checklistService: ChecklistService,
    private fileService: FileService,
  ) {}

  async createTasks(
    listId: string,
    createTasksDto: CreateTasksDto,
    workspaceId: string,
    currentMemberId: string,
    space: string,
  ): Promise<Task[]> {
    const createdTasks: Task[] = [];

    for (const taskData of createTasksDto.tasks) {
      const newTask = this.taskRepository.create({
        task_id: `TASK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: taskData.name,
        description: taskData.description,
        priority: taskData.priority,
        status: taskData.status,
        timeframe: taskData.timeframe,
        assigneeIds: [],
        listId,
        spaceId: space,
        workspaceId,
        createdById: currentMemberId,
      });

      const savedTask = await this.taskRepository.save(newTask);
      createdTasks.push(savedTask);
    }

    return createdTasks;
  }

  async updateTask(
    listId: string,
    taskId: string,
    updateTaskDto: UpdateTaskDto,
    workspaceId: string,
  ): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: {
        id: taskId,
        listId,
        workspaceId,
        isDeleted: false,
      },
    });

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
      task.assigneeIds = updateTaskDto.assignee;
    }

    return await this.taskRepository.save(task);
  }

  async getAllTasksByGroup(
    listId: string,
    workspaceId: string,
    queryParams: GetTasksByGroupQueryDto,
    currentMemberId?: string,
  ): Promise<{ tasks: Task[]; totalCount: number; hasMore: boolean }> {
    const queryBuilder = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.createdBy', 'createdBy')
      .where('task.listId = :listId', { listId })
      .andWhere('task.workspaceId = :workspaceId', { workspaceId })
      .andWhere('task.isDeleted = :isDeleted', { isDeleted: false });

    if (queryParams.meMode && currentMemberId) {
      queryBuilder.andWhere(':memberId = ANY(task.assigneeIds)', { memberId: currentMemberId });
    }

    if (queryParams.status) {
      queryBuilder.andWhere('task.status = :status', { status: queryParams.status });
    }

    if (queryParams.priority) {
      if (queryParams.priority === 'none') {
        queryBuilder.andWhere('task.priority IS NULL');
      } else {
        queryBuilder.andWhere('task.priority = :priority', { priority: queryParams.priority });
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
          queryBuilder.andWhere("(task.timeframe->>'end')::timestamp < :today", { today });
          break;
        case 'today':
          queryBuilder.andWhere("(task.timeframe->>'end')::timestamp >= :today AND (task.timeframe->>'end')::timestamp < :tomorrow", { today, tomorrow });
          break;
        case 'tomorrow':
          queryBuilder.andWhere("(task.timeframe->>'end')::timestamp >= :tomorrow AND (task.timeframe->>'end')::timestamp < :dayAfterTomorrow", { 
            tomorrow, 
            dayAfterTomorrow: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000) 
          });
          break;
        case 'this_week':
          queryBuilder.andWhere("(task.timeframe->>'end')::timestamp >= :dayAfterTomorrow AND (task.timeframe->>'end')::timestamp <= :endOfWeek", { 
            dayAfterTomorrow: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000),
            endOfWeek 
          });
          break;
        case 'later':
          queryBuilder.andWhere("(task.timeframe->>'end')::timestamp > :endOfWeek", { endOfWeek });
          break;
        case 'none':
          queryBuilder.andWhere("(task.timeframe->>'end' IS NULL OR task.timeframe IS NULL)");
          break;
      }
    }

    const skip = (queryParams.page - 1) * queryParams.limit;
    const totalCount = await queryBuilder.getCount();

    const tasks = await queryBuilder
      .orderBy('task.createdAt', 'DESC')
      .skip(skip)
      .take(queryParams.limit)
      .getMany();

    const hasMore = skip + tasks.length < totalCount;

    return {
      tasks,
      totalCount,
      hasMore,
    };
  }

  async getTasksGroupedByPriority(
    listId: string,
    workspaceId: string,
    queryParams: GetTasksByListQueryDto,
    currentMemberId?: string,
  ): Promise<GroupedTasks> {
    const grouped: GroupedTasks = {};
    const priorities = [...Object.values(TaskPriority), 'unassigned'];

    for (const priority of priorities) {
      const queryBuilder = this.taskRepository
        .createQueryBuilder('task')
        .leftJoinAndSelect('task.createdBy', 'createdBy')
        .where('task.listId = :listId', { listId })
        .andWhere('task.workspaceId = :workspaceId', { workspaceId })
        .andWhere('task.isDeleted = :isDeleted', { isDeleted: false });

      if (queryParams.meMode && currentMemberId) {
        queryBuilder.andWhere(':memberId = ANY(task.assigneeIds)', { memberId: currentMemberId });
      }

      if (queryParams.dueDate) {
        const startOfDay = new Date(queryParams.dueDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(queryParams.dueDate.setHours(23, 59, 59, 999));
        queryBuilder.andWhere("(task.timeframe->>'end')::timestamp >= :startOfDay AND (task.timeframe->>'end')::timestamp < :endOfDay", { 
          startOfDay, 
          endOfDay 
        });
      }

      if (priority === 'unassigned') {
        queryBuilder.andWhere('task.priority IS NULL');
      } else {
        queryBuilder.andWhere('task.priority = :priority', { priority });
      }

      const tasks = await queryBuilder
        .orderBy('task.createdAt', 'DESC')
        .limit(50)
        .getMany();

      grouped[priority] = {
        count: tasks.length,
        tasks,
      };
    }

    return grouped;
  }

  async getTasksGroupedByDueDate(
    listId: string,
    workspaceId: string,
    queryParams: GetTasksByListQueryDto,
    currentMemberId?: string,
  ): Promise<GroupedTasks> {
    const grouped: GroupedTasks = {};
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

    const dueStatusConfigs = [
      { status: 'overdue', where: "(task.timeframe->>'end')::timestamp < :today", params: { today } },
      { status: 'today', where: "(task.timeframe->>'end')::timestamp >= :today AND (task.timeframe->>'end')::timestamp < :tomorrow", params: { today, tomorrow } },
      { status: 'tomorrow', where: "(task.timeframe->>'end')::timestamp >= :tomorrow AND (task.timeframe->>'end')::timestamp < :dayAfterTomorrow", params: { tomorrow, dayAfterTomorrow: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000) } },
      { status: 'this_week', where: "(task.timeframe->>'end')::timestamp >= :dayAfterTomorrow AND (task.timeframe->>'end')::timestamp <= :endOfWeek", params: { dayAfterTomorrow: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000), endOfWeek } },
      { status: 'later', where: "(task.timeframe->>'end')::timestamp > :endOfWeek", params: { endOfWeek } },
      { status: 'none', where: "(task.timeframe->>'end' IS NULL OR task.timeframe IS NULL)", params: {} },
    ];

    for (const config of dueStatusConfigs) {
      const queryBuilder = this.taskRepository
        .createQueryBuilder('task')
        .leftJoinAndSelect('task.createdBy', 'createdBy')
        .where('task.listId = :listId', { listId })
        .andWhere('task.workspaceId = :workspaceId', { workspaceId })
        .andWhere('task.isDeleted = :isDeleted', { isDeleted: false })
        .andWhere(config.where, config.params);

      if (queryParams.meMode && currentMemberId) {
        queryBuilder.andWhere(':memberId = ANY(task.assigneeIds)', { memberId: currentMemberId });
      }

      const tasks = await queryBuilder
        .orderBy("(task.timeframe->>'end')::timestamp", 'ASC')
        .addOrderBy('task.createdAt', 'DESC')
        .limit(50)
        .getMany();

      grouped[config.status] = {
        count: tasks.length,
        tasks,
      };
    }

    return grouped;
  }

  async deleteTask(
    listId: string,
    taskId: string,
    workspaceId: string,
  ): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: {
        id: taskId,
        listId,
        workspaceId,
        isDeleted: false,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    task.isDeleted = true;
    return await this.taskRepository.save(task);
  }

  async getTaskDetails(
    listId: string,
    taskId: string,
    workspaceId: string,
  ): Promise<TaskDetailsResponse> {
    const task = await this.taskRepository.findOne({
      where: {
        id: taskId,
        listId,
        workspaceId,
        isDeleted: false,
      },
      relations: ['createdBy'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const checklist = await this.checklistService.getChecklistsByTask(
      taskId,
      workspaceId,
    );

    const files = await this.fileService.findByTask(taskId, workspaceId);

    return {
      task,
      checklist,
      files,
    };
  }
}
