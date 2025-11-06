import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Task, TaskPriority, TaskStatus } from '../schemas/task.schema';
import { Comment } from '../../../../comments/schemas/comment.schema';
import { WorkspaceMember } from '../../../../workspace-members/schemas/workspace-member.schema';
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
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(WorkspaceMember)
    private workspaceMemberRepository: Repository<WorkspaceMember>,
    private checklistService: ChecklistService,
    private fileService: FileService,
  ) {}

  private async populateTaskAssignees(task: Task): Promise<any> {
    if (!task.assigneeIds || task.assigneeIds.length === 0) {
      return { ...task, assignee: [] };
    }

    const assignees = await this.workspaceMemberRepository.find({
      where: {
        id: In(task.assigneeIds),
      },
    });

    return { ...task, assignee: assignees };
  }

  private async populateTasksAssignees(tasks: Task[]): Promise<any[]> {
    if (tasks.length === 0) return [];

    const allAssigneeIds = tasks
      .flatMap(task => task.assigneeIds || [])
      .filter((id, index, self) => id && self.indexOf(id) === index);

    if (allAssigneeIds.length === 0) {
      return tasks.map(task => ({ ...task, assignee: [] }));
    }

    const assignees = await this.workspaceMemberRepository.find({
      where: {
        id: In(allAssigneeIds),
      },
    });

    const assigneeMap = new Map(assignees.map(a => [a.id, a]));

    return tasks.map(task => ({
      ...task,
      assignee: (task.assigneeIds || [])
        .map(id => assigneeMap.get(id))
        .filter(Boolean),
    }));
  }

  async createTasks(
    listId: string,
    createTasksDto: CreateTasksDto,
    workspaceId: string,
    currentMemberId: string,
    space: string,
  ): Promise<Task[]> {
    const createdTasks: Task[] = [];

    for (const taskData of createTasksDto.tasks) {
      const dueDate = taskData.timeframe?.end ? new Date(taskData.timeframe.end) : null;
      
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
        dueDate,
        estimatedHours: taskData.estimatedHours || null,
        actualHours: null,
        startedAt: taskData.status === TaskStatus.IN_PROGRESS ? new Date() : null,
        statusChangedAt: new Date(),
        tags: taskData.tags || [],
        blockedByTaskIds: taskData.blockedByTaskIds || [],
        blockedReason: null,
        progress: 0,
      });

      const savedTask = await this.taskRepository.save(newTask);
      createdTasks.push(savedTask);
    }

    return await this.populateTasksAssignees(createdTasks);
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

    const oldStatus = task.status;

    if (updateTaskDto.name !== undefined) {
      task.name = updateTaskDto.name;
    }

    if (updateTaskDto.description !== undefined) {
      task.description = updateTaskDto.description;
    }

    if (updateTaskDto.status !== undefined) {
      task.status = updateTaskDto.status;
      task.statusChangedAt = new Date();
      
      if (updateTaskDto.status === TaskStatus.IN_PROGRESS && oldStatus !== TaskStatus.IN_PROGRESS) {
        task.startedAt = new Date();
      }
      
      if (updateTaskDto.status === TaskStatus.COMPLETED) {
        task.completedAt = new Date();
        
        const checklists = await this.checklistService.getChecklistsByTask(
          taskId,
          workspaceId,
        );
        
        if (checklists.length === 0) {
          task.progress = 100;
        }
      } else {
        task.completedAt = null;
      }
    }

    if (updateTaskDto.priority !== undefined) {
      task.priority = updateTaskDto.priority;
    }

    if (updateTaskDto.timeframe !== undefined) {
      task.timeframe = updateTaskDto.timeframe;
      task.dueDate = updateTaskDto.timeframe?.end || null;
    }

    if (updateTaskDto.assignee !== undefined) {
      task.assigneeIds = updateTaskDto.assignee;
    }

    if (updateTaskDto.estimatedHours !== undefined) {
      task.estimatedHours = updateTaskDto.estimatedHours;
    }

    if (updateTaskDto.actualHours !== undefined) {
      task.actualHours = updateTaskDto.actualHours;
    }

    if (updateTaskDto.blockedReason !== undefined) {
      if (updateTaskDto.blockedReason === null) {
        task.blockedReason = null;
      } else {
        task.blockedReason = {
          ...updateTaskDto.blockedReason,
          blockedAt: new Date(),
        };
      }
    }

    if (updateTaskDto.blockedByTaskIds !== undefined) {
      task.blockedByTaskIds = updateTaskDto.blockedByTaskIds;
    }

    if (updateTaskDto.tags !== undefined) {
      task.tags = updateTaskDto.tags;
    }

    const savedTask = await this.taskRepository.save(task);
    return await this.populateTaskAssignees(savedTask);
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

    if (queryParams.assignee_id) {
      if (queryParams.assignee_id === 'unassigned') {
        queryBuilder.andWhere('(task.assigneeIds IS NULL OR task.assigneeIds = ARRAY[]::text[] OR cardinality(task.assigneeIds) = 0)');
      } else {
        queryBuilder.andWhere(':assigneeId = ANY(task.assigneeIds)', { assigneeId: queryParams.assignee_id });
      }
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

    const populatedTasks = await this.populateTasksAssignees(tasks);

    return {
      tasks: populatedTasks,
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

      const populatedTasks = await this.populateTasksAssignees(tasks);

      grouped[priority] = {
        count: populatedTasks.length,
        tasks: populatedTasks,
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

      const populatedTasks = await this.populateTasksAssignees(tasks);

      grouped[config.status] = {
        count: populatedTasks.length,
        tasks: populatedTasks,
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
    const deletedTask = await this.taskRepository.save(task);
    return await this.populateTaskAssignees(deletedTask);
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

    const populatedTask = await this.populateTaskAssignees(task);

    return {
      task: populatedTask,
      checklist,
      files,
    };
  }

  async getTaskComments(
    taskId: string,
    workspaceId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ comments: Comment[]; totalCount: number; hasMore: boolean }> {
    const skip = (page - 1) * limit;

    const [comments, totalCount] = await this.commentRepository.findAndCount({
      where: {
        taskId,
        workspaceId,
        isDeleted: false,
      },
      relations: ['createdBy', 'parentComment'],
      order: {
        createdAt: 'ASC',
      },
      skip,
      take: limit,
    });

    const hasMore = skip + comments.length < totalCount;

    return {
      comments,
      totalCount,
      hasMore,
    };
  }

  async updateTaskProgress(taskId: string, workspaceId: string): Promise<void> {
    const checklists = await this.checklistService.getChecklistsByTask(
      taskId,
      workspaceId,
    );

    if (checklists.length === 0) {
      await this.taskRepository.update(
        { id: taskId, workspaceId },
        { progress: 0 }
      );
      return;
    }

    const completedCount = checklists.filter(item => item.isDone).length;
    const progress = (completedCount / checklists.length) * 100;

    await this.taskRepository.update(
      { id: taskId, workspaceId },
      { progress: Math.round(progress) }
    );
  }
}
