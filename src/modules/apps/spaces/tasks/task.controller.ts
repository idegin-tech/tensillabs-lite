/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
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
  updateTaskSchema,
  UpdateTaskDto,
  createTasksSchema,
  CreateTasksDto,
  getTasksByGroupQuerySchema,
  GetTasksByGroupQueryDto,
} from './dto/task.dto';
import { UploadService, UploadedFile } from '../../../../lib/upload.lib';
import { FileService } from '../../../files/services/file.service';

@Controller('lists/:listId/tasks')
@UseGuards(AuthGuard, WorkspaceMemberGuard, SpaceParticipationGuard)
@RequirePermission(MemberPermissions.REGULAR)
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly uploadService: UploadService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  async createTasks(
    @Param('listId') listId: string,
    @Body(new ZodValidationPipe(createTasksSchema))
    createTasksDto: CreateTasksDto,
    @Req()
    req: Request & {
      workspaceMember: any;
      workspace: any;
      space: any;
      list: any;
    },
  ) {
    const result = await this.taskService.createTasks(
      listId,
      createTasksDto,
      req.workspace.id,
      req.workspaceMember.id,
      req.space.id,
    );

    return createSuccessResponse('Tasks created successfully', result);
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
    const task = await this.taskService.updateTask(
      listId,
      taskId,
      updateTaskDto,
      req.workspace.id,
    );

    return createSuccessResponse('Task updated successfully', task);
  }

  @Get('group')
  async getAllTasksByGroup(
    @Param('listId') listId: string,
    @Query(new ZodValidationPipe(getTasksByGroupQuerySchema))
    queryParams: GetTasksByGroupQueryDto,
    @Req()
    req: Request & {
      workspaceMember: any;
      workspace: any;
      space: any;
      list: any;
    },
  ) {
    const tasks = await this.taskService.getAllTasksByGroup(
      listId,
      req.workspace.id,
      queryParams,
      queryParams.meMode ? req.workspaceMember.id : undefined,
    );

    return createSuccessResponse('Tasks retrieved successfully', tasks);
  }

  @Get(':taskId')
  async getTaskDetails(
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
    const taskDetails = await this.taskService.getTaskDetails(
      listId,
      taskId,
      req.workspace.id,
    );

    return createSuccessResponse(
      'Task details retrieved successfully',
      taskDetails,
    );
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
    const task = await this.taskService.deleteTask(
      listId,
      taskId,
      req.workspace.id,
    );

    return createSuccessResponse('Task deleted successfully', task);
  }

  @Post(':taskId/files')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  async uploadTaskFiles(
    @Param('listId') listId: string,
    @Param('taskId') taskId: string,
    @UploadedFiles() files: UploadedFile[],
    @Req()
    req: Request & {
      workspaceMember: any;
      workspace: any;
      space: any;
      list: any;
    },
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const uploadPath = `/spaces/${req.space.id}/lists/${listId}/tasks/${taskId}`;

    const uploadResults = await this.uploadService.uploadFiles(
      files,
      uploadPath,
      String(req.workspace.id),
    );

    const savedFiles = [];
    for (const uploadResult of uploadResults) {
      const savedFile = await this.fileService.create(
        {
          name: uploadResult.originalName,
          size: uploadResult.bytes,
          mimeType: uploadResult.mimeType,
          fileURL: uploadResult.secureUrl,
          fileKey: uploadResult.publicId,
          taskId: taskId,
          spaceId: req.space.id,
        },
        req.workspace.id,
        req.workspaceMember.id,
      );
      savedFiles.push(savedFile);
    }

    return createSuccessResponse('Files uploaded successfully', savedFiles);
  }
}
