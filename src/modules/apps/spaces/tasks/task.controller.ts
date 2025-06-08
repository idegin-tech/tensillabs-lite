/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
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
import { createSuccessResponse } from '../../../../lib/response.interface';
import { ZodValidationPipe } from '../../../../lib/validation.pipe';
import { createTaskSchema, CreateTaskDto } from './dto/task.dto';

@Controller('lists/:listId/tasks')
@UseGuards(AuthGuard, WorkspaceMemberGuard)
@RequirePermission(MemberPermissions.REGULAR)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(
    @Param('listId') listId: string,
    @Body(new ZodValidationPipe(createTaskSchema))
    createTaskDto: CreateTaskDto,
    @Req() req: Request & { workspaceMember: any; workspace: any },
  ) {
    if (!Types.ObjectId.isValid(listId)) {
      throw new BadRequestException('Invalid list ID format');
    }

    const task = await this.taskService.create(
      new Types.ObjectId(listId),
      createTaskDto,
      req.workspace._id,
      req.workspaceMember._id,
    );

    return createSuccessResponse('Task created successfully', task);
  }

  @Get()
  async getTasksByList(
    @Param('listId') listId: string,
    @Req() req: Request & { workspaceMember: any; workspace: any },
  ) {
    if (!Types.ObjectId.isValid(listId)) {
      throw new BadRequestException('Invalid list ID format');
    }

    const tasks = await this.taskService.getTasksByList(
      new Types.ObjectId(listId),
      req.workspace._id,
      req.workspaceMember._id,
    );

    return createSuccessResponse('Tasks retrieved successfully', tasks);
  }
}
