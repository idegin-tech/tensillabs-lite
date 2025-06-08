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
  BadRequestException,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { Types } from 'mongoose';
import { AuthGuard } from '../../auth/guards/auth.guard';
import {
  WorkspaceMemberGuard,
  RequirePermission,
} from '../../workspace-members/guards/workspace-member.guard';
import { MemberPermissions } from '../../workspace-members/enums/member-permissions.enum';
import { ClientService } from './services/client.service';
import { createSuccessResponse } from '../../../lib/response.interface';
import { ZodValidationPipe } from '../../../lib/validation.pipe';
import {
  PaginationDto,
  paginationSchema,
} from '../../workspace-members/dto/pagination.dto';
import {
  createClientSchema,
  updateClientSchema,
  CreateClientDto,
  UpdateClientDto,
} from './dto/client.dto';

@Controller('clients')
@UseGuards(AuthGuard, WorkspaceMemberGuard)
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @RequirePermission(MemberPermissions.MANAGER)
  @UsePipes(new ZodValidationPipe(createClientSchema))
  async create(
    @Body() createClientDto: CreateClientDto,
    @Req() req: Request & { workspaceMember: any; workspace: any },
  ) {
    const client = await this.clientService.create(
      createClientDto,
      req.workspace._id,
      req.workspaceMember._id,
    );

    return createSuccessResponse('Client created successfully', client);
  }

  @Get()
  @RequirePermission(MemberPermissions.REGULAR)
  @UsePipes(new ZodValidationPipe(paginationSchema))
  async findAll(
    @Query() pagination: PaginationDto,
    @Req() req: Request & { workspace: any },
  ) {
    const clients = await this.clientService.findAll(
      req.workspace._id,
      pagination,
    );
    return createSuccessResponse('Clients retrieved successfully', clients);
  }

  @Put(':id')
  @RequirePermission(MemberPermissions.MANAGER)
  @UsePipes(new ZodValidationPipe(updateClientSchema))
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
    @Req() req: Request & { workspace: any },
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid client ID format');
    }

    const client = await this.clientService.update(
      new Types.ObjectId(id),
      updateClientDto,
      req.workspace._id,
    );

    return createSuccessResponse('Client updated successfully', client);
  }

  @Patch(':id/toggle-active')
  @RequirePermission(MemberPermissions.MANAGER)
  async toggleActive(
    @Param('id') id: string,
    @Req() req: Request & { workspace: any },
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid client ID format');
    }

    const client = await this.clientService.toggleActive(
      new Types.ObjectId(id),
      req.workspace._id,
    );

    return createSuccessResponse('Client status updated successfully', client);
  }

  @Patch(':id/trash')
  @RequirePermission(MemberPermissions.MANAGER)
  async moveToTrash(
    @Param('id') id: string,
    @Req() req: Request & { workspace: any },
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid client ID format');
    }

    const client = await this.clientService.moveToTrash(
      new Types.ObjectId(id),
      req.workspace._id,
    );

    return createSuccessResponse('Client moved to trash successfully', client);
  }
}
