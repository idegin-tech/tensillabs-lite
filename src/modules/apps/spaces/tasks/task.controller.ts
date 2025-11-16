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
import { WorkspaceMemberGuard } from '../../../workspace-members/guards/workspace-member.guard';
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
  searchTasksQuerySchema,
  SearchTasksQueryDto,
  getTaskReportsQuerySchema,
  GetTaskReportsQueryDto,
} from './dto/task.dto';
import {
  createCommentSchema,
  CreateCommentDto,
  addReactionSchema,
  AddReactionDto,
} from '../../../comments/dto/comment.dto';
import {
  createChecklistSchema,
  updateChecklistSchema,
  CreateChecklistDto,
  UpdateChecklistDto,
} from '../../../checklists/dto/checklist.dto';
import { ChecklistService } from '../../../checklists/services/checklist.service';
import { CommentService } from '../../../comments/services/comment.service';
import { UploadService, UploadedFile } from '../../../../lib/upload.lib';
import { FileService } from '../../../files/services/file.service';

@Controller('lists/:listId/tasks')
@UseGuards(AuthGuard, WorkspaceMemberGuard, SpaceParticipationGuard)
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly uploadService: UploadService,
    private readonly fileService: FileService,
    private readonly commentService: CommentService,
    private readonly checklistService: ChecklistService,
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
      req.workspaceMember.id,
    );

    return createSuccessResponse('Task updated successfully', task);
  }

  @Get('reports')
  async getTaskReports(
    @Param('listId') listId: string,
    @Query(new ZodValidationPipe(getTaskReportsQuerySchema))
    queryParams: GetTaskReportsQueryDto,
    @Req()
    req: Request & {
      workspaceMember: any;
      workspace: any;
      space: any;
      list: any;
    },
  ) {
    const result = await this.taskService.getTaskReports(
      listId,
      req.workspace.id,
      queryParams,
    );

    return createSuccessResponse('Task reports retrieved successfully', result);
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

  @Get('search')
  async searchTasks(
    @Query(new ZodValidationPipe(searchTasksQuerySchema))
    queryParams: SearchTasksQueryDto,
    @Req()
    req: Request & {
      workspaceMember: any;
      workspace: any;
    },
  ) {
    const tasks = await this.taskService.searchTasks(req.workspace.id, {
      search: queryParams.search,
      listId: queryParams.listId,
      spaceId: queryParams.spaceId,
      limit: queryParams.limit,
    });

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

    const uploadPath = `/tasks/${taskId}`;

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

  @Get(':taskId/comments')
  async getTaskComments(
    @Param('listId') listId: string,
    @Param('taskId') taskId: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Req()
    req: Request & {
      workspaceMember: any;
      workspace: any;
      space: any;
      list: any;
    },
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 20;

    const result = await this.commentService.getTaskComments(
      taskId,
      req.workspace.id,
      pageNumber,
      limitNumber,
    );

    return createSuccessResponse('Comments retrieved successfully', result);
  }

  @Post(':taskId/comments')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  async createComment(
    @Param('listId') listId: string,
    @Param('taskId') taskId: string,
    @Body(new ZodValidationPipe(createCommentSchema))
    createCommentDto: CreateCommentDto,
    @UploadedFiles() files: UploadedFile[],
    @Req()
    req: Request & {
      workspaceMember: any;
      workspace: any;
      space: any;
      list: any;
    },
  ) {
    const comment = await this.commentService.create(
      createCommentDto,
      req.workspace.id,
      req.workspaceMember.id,
      taskId,
      listId,
      req.space.id,
      null,
    );

    let uploadedFiles = [];
    if (files && files.length > 0) {
      const uploadPath = `/tasks/${taskId}/comments/${comment.id}`;

      const uploadResults = await this.uploadService.uploadFiles(
        files,
        uploadPath,
        String(req.workspace.id),
      );

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
            commentId: comment.id,
            listId: listId,
          },
          req.workspace.id,
          req.workspaceMember.id,
        );
        uploadedFiles.push(savedFile);
      }
    }

    return createSuccessResponse('Comment created successfully', {
      comment,
      files: uploadedFiles,
    });
  }

  @Get(':taskId/checklists')
  async getTaskChecklists(
    @Param('listId') listId: string,
    @Param('taskId') taskId: string,
    @Req()
    req: Request & {
      workspaceMember: any;
      workspace: any;
    },
  ) {
    const checklists = await this.checklistService.getChecklistsByTask(
      taskId,
      req.workspace.id,
    );

    return createSuccessResponse(
      'Checklists retrieved successfully',
      checklists,
    );
  }

  @Post(':taskId/checklists')
  async createTaskChecklist(
    @Param('listId') listId: string,
    @Param('taskId') taskId: string,
    @Body(new ZodValidationPipe(createChecklistSchema))
    createChecklistDto: CreateChecklistDto,
    @Req()
    req: Request & {
      workspaceMember: any;
      workspace: any;
      space: any;
      list: any;
    },
  ) {
    const checklistData = {
      ...createChecklistDto,
      task: taskId,
      space: req.space.id,
      list: listId,
    };

    const checklist = await this.checklistService.createChecklist(
      checklistData,
      req.workspace.id,
      req.workspaceMember.id,
    );

    await this.taskService.updateTaskProgress(taskId, req.workspace.id);

    return createSuccessResponse('Checklist created successfully', checklist);
  }

  @Put(':taskId/checklists/:checklistId')
  async updateTaskChecklist(
    @Param('listId') listId: string,
    @Param('taskId') taskId: string,
    @Param('checklistId') checklistId: string,
    @Body(new ZodValidationPipe(updateChecklistSchema))
    updateChecklistDto: UpdateChecklistDto,
    @Req()
    req: Request & {
      workspaceMember: any;
      workspace: any;
    },
  ) {
    const checklist = await this.checklistService.updateChecklist(
      checklistId,
      updateChecklistDto,
      req.workspace.id,
    );

    await this.taskService.updateTaskProgress(taskId, req.workspace.id);

    return createSuccessResponse('Checklist updated successfully', checklist);
  }

  @Delete(':taskId/checklists/:checklistId')
  async deleteTaskChecklist(
    @Param('listId') listId: string,
    @Param('taskId') taskId: string,
    @Param('checklistId') checklistId: string,
    @Req()
    req: Request & {
      workspaceMember: any;
      workspace: any;
    },
  ) {
    const checklist = await this.checklistService.deleteChecklist(
      checklistId,
      req.workspace.id,
    );

    await this.taskService.updateTaskProgress(taskId, req.workspace.id);

    return createSuccessResponse('Checklist deleted successfully', checklist);
  }
}
