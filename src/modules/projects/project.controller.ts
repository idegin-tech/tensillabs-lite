import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UsePipes,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ProjectService } from './services/project.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { WorkspaceMemberGuard } from '../workspace-members/guards/workspace-member.guard';
import { RequirePermission } from '../workspace-members/guards/workspace-member.guard';
import { MemberPermissions } from '../workspace-members/enums/member-permissions.enum';
import { ZodValidationPipe } from '../../lib/validation.pipe';
import { createSuccessResponse } from '../../lib/response.interface';
import {
  PaginationDto,
  paginationSchema,
} from '../workspace-members/dto/pagination.dto';
import {
  CreateProjectDto,
  createProjectSchema,
  ToggleActiveDto,
  toggleActiveSchema,
  UpdateProjectDto,
  updateProjectSchema,
} from './dto/project.dto';

@Controller('projects')
@UseGuards(AuthGuard, WorkspaceMemberGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @RequirePermission(MemberPermissions.ADMIN)
  @UsePipes(new ZodValidationPipe(createProjectSchema))
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Req() req: Request & { workspaceMember: any; workspace: any },
  ) {
    const project = await this.projectService.create(
      createProjectDto,
      req.workspace.id,
      req.workspaceMember.id,
    );

    return createSuccessResponse('Project created successfully', project);
  }

  @Get()
  @RequirePermission(MemberPermissions.REGULAR)
  @UsePipes(new ZodValidationPipe(paginationSchema))
  async findAll(
    @Query() pagination: PaginationDto,
    @Req() req: Request & { workspace: any },
  ) {
    const projects = await this.projectService.findAll(
      req.workspace.id,
      pagination,
    );
    return createSuccessResponse('Projects retrieved successfully', projects);
  }

  @Put(':id')
  @RequirePermission(MemberPermissions.ADMIN)
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateProjectSchema))
    updateProjectDto: UpdateProjectDto,
    @Req() req: Request & { workspace: any },
  ) {
    const project = await this.projectService.update(
      id,
      updateProjectDto,
      req.workspace.id,
    );

    return createSuccessResponse('Project updated successfully', project);
  }

  @Put(':id/toggle-active')
  @RequirePermission(MemberPermissions.ADMIN)
  async toggleActive(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(toggleActiveSchema)) body: ToggleActiveDto,
    @Req() req: Request & { workspace: any },
  ) {
    const project = await this.projectService.toggleActive(
      id,
      body.isActive,
      req.workspace.id,
    );

    return createSuccessResponse(
      'Project status updated successfully',
      project,
    );
  }

  @Delete(':id')
  @RequirePermission(MemberPermissions.ADMIN)
  async delete(
    @Param('id') id: string,
    @Req() req: Request & { workspace: any },
  ) {
    const project = await this.projectService.delete(
      id,
      req.workspace.id,
    );

    return createSuccessResponse('Project deleted successfully', project);
  }
}
