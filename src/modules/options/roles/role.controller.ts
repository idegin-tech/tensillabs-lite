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
  createRoleSchema,
  updateRoleSchema,
  toggleActiveSchema,
  CreateRoleDto,
  UpdateRoleDto,
  ToggleActiveDto,
} from './dto/role.dto';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import {
  RequirePermission,
  WorkspaceMemberGuard,
} from 'src/modules/workspace-members/guards/workspace-member.guard';
import { MemberPermissions } from 'src/modules/workspace-members/enums/member-permissions.enum';
import { RoleService } from './services/role.service';
import {
  paginationSchema,
  PaginationDto,
} from '../../workspace-members/dto/pagination.dto';
import { createSuccessResponse } from '../../../lib/response.interface';
import { ZodValidationPipe } from '../../../lib/validation.pipe';

@Controller('roles')
@UseGuards(AuthGuard, WorkspaceMemberGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @RequirePermission(MemberPermissions.MANAGER)
  @UsePipes(new ZodValidationPipe(createRoleSchema))
  async create(
    @Body() createRoleDto: CreateRoleDto,
    @Req() req: Request & { workspaceMember: any; workspace: any },
  ) {
    const role = await this.roleService.create(
      createRoleDto,
      req.workspace.id,
      req.workspaceMember.id,
    );

    return createSuccessResponse('Role created successfully', role);
  }

  @Get()
  @RequirePermission(MemberPermissions.REGULAR)
  @UsePipes(new ZodValidationPipe(paginationSchema))
  async findAll(
    @Query() pagination: PaginationDto,
    @Req() req: Request & { workspace: any },
  ) {
    const roles = await this.roleService.findAll(req.workspace.id, pagination);

    return createSuccessResponse('Roles retrieved successfully', roles);
  }

  @Put(':id')
  @RequirePermission(MemberPermissions.MANAGER)
  @UsePipes(new ZodValidationPipe(updateRoleSchema))
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Req() req: Request & { workspace: any },
  ) {
    const role = await this.roleService.update(
      id,
      updateRoleDto,
      req.workspace.id,
    );

    return createSuccessResponse('Role updated successfully', role);
  }

  @Patch(':id/trash')
  @RequirePermission(MemberPermissions.MANAGER)
  async moveToTrash(
    @Param('id') id: string,
    @Req() req: Request & { workspace: any },
  ) {
    const role = await this.roleService.moveToTrash(
      id,
      req.workspace.id,
    );

    return createSuccessResponse('Role moved to trash successfully', role);
  }

  @Patch(':id/toggle-active')
  @RequirePermission(MemberPermissions.MANAGER)
  @UsePipes(new ZodValidationPipe(toggleActiveSchema))
  async toggleActive(
    @Param('id') id: string,
    @Body() toggleActiveDto: ToggleActiveDto,
    @Req() req: Request & { workspace: any },
  ) {
    const role = await this.roleService.toggleActive(
      id,
      toggleActiveDto.isActive,
      req.workspace.id,
    );

    return createSuccessResponse('Role status updated successfully', role);
  }
}
