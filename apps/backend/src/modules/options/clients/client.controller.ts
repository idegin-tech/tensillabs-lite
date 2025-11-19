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
import { WorkspaceMemberGuard } from '../../workspace-members/guards/workspace-member.guard';
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
  toggleActiveSchema,
  CreateClientDto,
  UpdateClientDto,
  ToggleActiveDto,
} from './dto/client.dto';

@Controller('clients')
@UseGuards(AuthGuard, WorkspaceMemberGuard)
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createClientSchema))
  async create(
    @Body() createClientDto: CreateClientDto,
    @Req() req: Request & { workspaceMember: any; workspace: any },
  ) {
    const client = await this.clientService.create(
      createClientDto,
      req.workspace.id,
      req.workspaceMember.id,
    );

    return createSuccessResponse('Client created successfully', client);
  }

  @Get()
  @UsePipes(new ZodValidationPipe(paginationSchema))
  async findAll(
    @Query() pagination: PaginationDto,
    @Req() req: Request & { workspace: any },
  ) {
    const clients = await this.clientService.findAll(
      req.workspace.id,
      pagination,
    );
    return createSuccessResponse('Clients retrieved successfully', clients);
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateClientSchema))
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
    @Req() req: Request & { workspace: any },
  ) {
    const client = await this.clientService.update(
      id,
      updateClientDto,
      req.workspace.id,
    );

    return createSuccessResponse('Client updated successfully', client);
  }

  @Patch(':id/toggle-active')
  @UsePipes(new ZodValidationPipe(toggleActiveSchema))
  async toggleActive(
    @Param('id') id: string,
    @Body() toggleActiveDto: ToggleActiveDto,
    @Req() req: Request & { workspace: any },
  ) {
    const client = await this.clientService.toggleActive(
      id,
      toggleActiveDto.isActive,
      req.workspace.id,
    );

    return createSuccessResponse('Client status updated successfully', client);
  }

  @Patch(':id/trash')
  async moveToTrash(
    @Param('id') id: string,
    @Req() req: Request & { workspace: any },
  ) {
    const client = await this.clientService.moveToTrash(
      id,
      req.workspace.id,
    );

    return createSuccessResponse('Client moved to trash successfully', client);
  }
}
