/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { Types } from 'mongoose';
import { TaskService } from './services/task.service';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import {
  WorkspaceMemberGuard,
  RequirePermission,
} from '../../../workspace-members/guards/workspace-member.guard';
import { MemberPermissions } from '../../../workspace-members/enums/member-permissions.enum';
import { SpaceParticipationGuard } from '../guards/space-participation.guard';
import { createSuccessResponse } from '../../../../lib/response.interface';
import { ZodValidationPipe } from '../../../../lib/validation.pipe';
import {
  syncTasksSchema,
  SyncTasksDto,
  updateTaskSchema,
  UpdateTaskDto,
  getTasksByListQuerySchema,
  GetTasksByListQueryDto,
} from './dto/task.dto';

@Controller('lists/:listId/tasks')
@UseGuards(AuthGuard, WorkspaceMemberGuard, SpaceParticipationGuard)
@RequirePermission(MemberPermissions.REGULAR)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('sync')
  async syncTasks(
    @Param('listId') listId: string,
    @Body(new ZodValidationPipe(syncTasksSchema))
    syncTasksDto: SyncTasksDto,
    @Req()
    req: Request & {
      workspaceMember: any;
      workspace: any;
      space: any;
      list: any;
    },
  ) {
    const result = await this.taskService.syncTasks(
      new Types.ObjectId(listId),
      syncTasksDto,
      req.workspace._id,
      req.workspaceMember._id,
      req.space._id,
    );

    return createSuccessResponse('Tasks synced successfully', result);
  }

  @Put(':taskId')
  async updateTask(
    @Param('listId') listId: string,
    @Param('taskId') taskId: string,
    @Body(new ZodValidationPipe(updateTaskSchema))
    updateTaskDto: UpdateTaskDto,
    @Req()
    req: Request & {
      workspaceMember: any;
      workspace: any;
      space: any;
      list: any;
    },
  ) {
    if (!Types.ObjectId.isValid(taskId)) {
      throw new BadRequestException('Invalid task ID format');
    }

    const task = await this.taskService.updateTask(
      new Types.ObjectId(listId),
      new Types.ObjectId(taskId),
      updateTaskDto,
      req.workspace._id,
    );

    return createSuccessResponse('Task updated successfully', task);
  }

  @Get()
  async getTasksByList(
    @Param('listId') listId: string,
    @Query(new ZodValidationPipe(getTasksByListQuerySchema))
    queryParams: GetTasksByListQueryDto,
    @Req()
    req: Request & {
      workspaceMember: any;
      workspace: any;
      space: any;
      list: any;
    },
  ) {
    if (!Types.ObjectId.isValid(listId)) {
      throw new BadRequestException('Invalid list ID format');
    }

    const tasks = await this.taskService.getTasksByList(
      new Types.ObjectId(listId),
      req.workspace._id,
      queryParams,
      queryParams.meMode ? req.workspaceMember._id : undefined,
    );

    return createSuccessResponse('Tasks retrieved successfully', tasks);
  }

  @Delete(':taskId')
  async deleteTask(
    @Param('listId') listId: string,
    @Param('taskId') taskId: string,
    @Req()
    req: Request & {
      workspaceMember: any;
      workspace: any;
      space: any;
      list: any;
    },
  ) {
    if (!Types.ObjectId.isValid(listId)) {
      throw new BadRequestException('Invalid list ID format');
    }

    if (!Types.ObjectId.isValid(taskId)) {
      throw new BadRequestException('Invalid task ID format');
    }

    const task = await this.taskService.deleteTask(
      new Types.ObjectId(listId),
      new Types.ObjectId(taskId),
      req.workspace._id,
    );

    return createSuccessResponse('Task deleted successfully', task);
  }
}
