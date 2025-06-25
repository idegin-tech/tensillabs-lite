/* eslint-disable prettier/prettier */
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
} from '@nestjs/common';
import { Request } from 'express';
import { Types } from 'mongoose';
import { ChecklistService } from './services/checklist.service';
import {
  createChecklistSchema,
  CreateChecklistDto,
  updateChecklistSchema,
  UpdateChecklistDto,
  getChecklistsQuerySchema,
  GetChecklistsQueryDto,
} from './dto/checklist.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RequirePermission, WorkspaceMemberGuard } from '../workspace-members/guards/workspace-member.guard';
import { MemberPermissions } from '../workspace-members/enums/member-permissions.enum';
import { ZodValidationPipe } from 'src/lib/validation.pipe';
import { createSuccessResponse } from 'src/lib/response.interface';

@Controller('checklists')
@UseGuards(AuthGuard, WorkspaceMemberGuard)
@RequirePermission(MemberPermissions.REGULAR)
export class ChecklistController {
  constructor(private readonly checklistService: ChecklistService) {}

  @Post()
  async createChecklist(
    @Body(new ZodValidationPipe(createChecklistSchema))
    createChecklistDto: CreateChecklistDto,
    @Req()
    req: Request & {
      workspaceMember: any;
      workspace: any;
    },
  ) {
    const result = await this.checklistService.createChecklist(
      createChecklistDto,
      req.workspace._id,
      req.workspaceMember._id,
    );

    return createSuccessResponse('Checklist created successfully', result);
  }

  @Get()
  async getAllChecklists(
    @Query(new ZodValidationPipe(getChecklistsQuerySchema))
    queryParams: GetChecklistsQueryDto,
    @Req()
    req: Request & {
      workspaceMember: any;
      workspace: any;
    },
  ) {
    const result = await this.checklistService.getAllChecklists(
      queryParams,
      req.workspace._id,
    );

    return createSuccessResponse('Checklists retrieved successfully', result);
  }

  @Put(':checklistId')
  async updateChecklist(
    @Param('checklistId') checklistId: string,
    @Body(new ZodValidationPipe(updateChecklistSchema))
    updateChecklistDto: UpdateChecklistDto,
    @Req()
    req: Request & {
      workspaceMember: any;
      workspace: any;
    },
  ) {
    if (!Types.ObjectId.isValid(checklistId)) {
      throw new BadRequestException('Invalid checklist ID format');
    }

    const result = await this.checklistService.updateChecklist(
      new Types.ObjectId(checklistId),
      updateChecklistDto,
      req.workspace._id,
    );

    return createSuccessResponse('Checklist updated successfully', result);
  }

  @Delete(':checklistId')
  async deleteChecklist(
    @Param('checklistId') checklistId: string,
    @Req()
    req: Request & {
      workspaceMember: any;
      workspace: any;
    },
  ) {
    if (!Types.ObjectId.isValid(checklistId)) {
      throw new BadRequestException('Invalid checklist ID format');
    }

    const result = await this.checklistService.deleteChecklist(
      new Types.ObjectId(checklistId),
      req.workspace._id,
    );

    return createSuccessResponse('Checklist deleted successfully', result);
  }
}
