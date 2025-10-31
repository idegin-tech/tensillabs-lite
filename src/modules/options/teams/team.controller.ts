import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  UsePipes,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import {
  createTeamSchema,
  updateTeamSchema,
  toggleActiveSchema,
  CreateTeamDto,
  UpdateTeamDto,
  ToggleActiveDto,
} from './dto/team.dto';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import {
  RequirePermission,
  WorkspaceMemberGuard,
} from 'src/modules/workspace-members/guards/workspace-member.guard';
import { MemberPermissions } from 'src/modules/workspace-members/enums/member-permissions.enum';
import { TeamService } from './services/team.service';
import { ZodValidationPipe } from 'src/lib/validation.pipe';
import { createSuccessResponse } from 'src/lib/response.interface';
import {
  PaginationDto,
  paginationSchema,
} from 'src/modules/workspace-members/dto/pagination.dto';

@Controller('teams')
@UseGuards(AuthGuard, WorkspaceMemberGuard)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @RequirePermission(MemberPermissions.MANAGER)
  @UsePipes(new ZodValidationPipe(createTeamSchema))
  async create(
    @Body() createTeamDto: CreateTeamDto,
    @Req() req: Request & { workspaceMember: any; workspace: any },
  ) {
    const team = await this.teamService.create(
      createTeamDto,
      req.workspace.id,
      req.workspaceMember.id,
    );

    return createSuccessResponse('Team created successfully', team);
  }

  @Get()
  @RequirePermission(MemberPermissions.REGULAR)
  @UsePipes(new ZodValidationPipe(paginationSchema))
  async findAll(
    @Query() pagination: PaginationDto,
    @Req() req: Request & { workspace: any },
  ) {
    const teams = await this.teamService.findAll(req.workspace.id, pagination);

    return createSuccessResponse('Teams retrieved successfully', teams);
  }

  @Put(':id')
  @RequirePermission(MemberPermissions.MANAGER)
  @UsePipes(new ZodValidationPipe(updateTeamSchema))
  async update(
    @Param('id') id: string,
    @Body() updateTeamDto: UpdateTeamDto,
    @Req() req: Request & { workspace: any },
  ) {
    const team = await this.teamService.update(
      id,
      updateTeamDto,
      req.workspace.id,
    );

    return createSuccessResponse('Team updated successfully', team);
  }

  @Patch(':id/trash')
  @RequirePermission(MemberPermissions.MANAGER)
  async moveToTrash(
    @Param('id') id: string,
    @Req() req: Request & { workspace: any },
  ) {
    const team = await this.teamService.moveToTrash(
      id,
      req.workspace.id,
    );

    return createSuccessResponse('Team moved to trash successfully', team);
  }

  @Patch(':id/toggle-active')
  @RequirePermission(MemberPermissions.MANAGER)
  @UsePipes(new ZodValidationPipe(toggleActiveSchema))
  async toggleActive(
    @Param('id') id: string,
    @Body() toggleActiveDto: ToggleActiveDto,
    @Req() req: Request & { workspace: any },
  ) {
    const team = await this.teamService.toggleActive(
      id,
      toggleActiveDto.isActive,
      req.workspace.id,
    );

    return createSuccessResponse('Team status updated successfully', team);
  }
}
