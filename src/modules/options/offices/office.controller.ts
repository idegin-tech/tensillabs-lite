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
import { AuthGuard } from '../../auth/guards/auth.guard';
import {
  WorkspaceMemberGuard,
  RequirePermission,
} from '../../workspace-members/guards/workspace-member.guard';
import { MemberPermissions } from '../../workspace-members/enums/member-permissions.enum';
import { OfficeService } from './services/office.service';
import { createSuccessResponse } from '../../../lib/response.interface';
import { ZodValidationPipe } from '../../../lib/validation.pipe';
import {
  PaginationDto,
  paginationSchema,
} from '../../workspace-members/dto/pagination.dto';
import {
  createOfficeSchema,
  updateOfficeSchema,
  toggleActiveSchema,
  CreateOfficeDto,
  UpdateOfficeDto,
  ToggleActiveDto,
} from './dto/office.dto';

@Controller('offices')
@UseGuards(AuthGuard, WorkspaceMemberGuard)
export class OfficeController {
  constructor(private readonly officeService: OfficeService) {}

  @Post()
  @RequirePermission(MemberPermissions.MANAGER)
  @UsePipes(new ZodValidationPipe(createOfficeSchema))
  async create(
    @Body() createOfficeDto: CreateOfficeDto,
    @Req() req: Request & { workspaceMember: any; workspace: any },
  ) {
    const office = await this.officeService.create(
      createOfficeDto,
      req.workspace.id,
      req.workspaceMember.id,
    );

    return createSuccessResponse('Office created successfully', office);
  }

  @Get()
  @RequirePermission(MemberPermissions.REGULAR)
  @UsePipes(new ZodValidationPipe(paginationSchema))
  async findAll(
    @Query() pagination: PaginationDto,
    @Req() req: Request & { workspace: any },
  ) {
    const offices = await this.officeService.findAll(
      req.workspace.id,
      pagination,
    );
    return createSuccessResponse('Offices retrieved successfully', offices);
  }

  @Put(':id')
  @RequirePermission(MemberPermissions.MANAGER)
  @UsePipes(new ZodValidationPipe(updateOfficeSchema))
  async update(
    @Param('id') id: string,
    @Body() updateOfficeDto: UpdateOfficeDto,
    @Req() req: Request & { workspace: any },
  ) {
    const office = await this.officeService.update(
      id,
      updateOfficeDto,
      req.workspace.id,
    );

    return createSuccessResponse('Office updated successfully', office);
  }

  @Patch(':id/toggle-active')
  @RequirePermission(MemberPermissions.MANAGER)
  @UsePipes(new ZodValidationPipe(toggleActiveSchema))
  async toggleActive(
    @Param('id') id: string,
    @Body() body: ToggleActiveDto,
    @Req() req: Request & { workspace: any },
  ) {
    const office = await this.officeService.toggleActive(
      id,
      body.isActive,
      req.workspace.id,
    );

    return createSuccessResponse('Office status updated successfully', office);
  }

  @Patch(':id/trash')
  @RequirePermission(MemberPermissions.MANAGER)
  async moveToTrash(
    @Param('id') id: string,
    @Req() req: Request & { workspace: any },
  ) {
    const office = await this.officeService.moveToTrash(
      id,
      req.workspace.id,
    );

    return createSuccessResponse('Office moved to trash successfully', office);
  }
}
