/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { Types } from 'mongoose';
import { SpaceService } from './services/space.service';
import { SpaceParticipantService } from './space-participants/services/space-participant.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import {
  WorkspaceMemberGuard,
  RequirePermission,
} from '../../workspace-members/guards/workspace-member.guard';
import { MemberPermissions } from '../../workspace-members/enums/member-permissions.enum';
import { SpaceParticipationGuard } from './guards/space-participation.guard';
import { SpaceAdminGuard } from './guards/space-admin.guard';
import { createSuccessResponse } from '../../../lib/response.interface';
import { ZodValidationPipe } from '../../../lib/validation.pipe';
import {
  createSpaceSchema,
  updateSpaceSchema,
  CreateSpaceDto,
  UpdateSpaceDto,
} from './dto/space.dto';
import {
  paginationSchema,
  PaginationDto,
} from '../../workspace-members/dto/pagination.dto';

@Controller('spaces')
@UseGuards(AuthGuard, WorkspaceMemberGuard)
@RequirePermission(MemberPermissions.REGULAR)
export class SpaceController {
  constructor(
    private readonly spaceService: SpaceService,
    private readonly spaceParticipantService: SpaceParticipantService,
  ) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(createSpaceSchema))
    createSpaceDto: CreateSpaceDto,
    @Req() req: Request & { workspaceMember: any; workspace: any },
  ) {
    const space = await this.spaceService.create(
      createSpaceDto,
      req.workspace._id as Types.ObjectId,
      req.workspaceMember._id as Types.ObjectId,
    );

    return createSuccessResponse('Space created successfully', space);
  }

  @Get()
  async getSpaces(
    @Query(new ZodValidationPipe(paginationSchema)) pagination: PaginationDto,
    @Req() req: Request & { workspaceMember: any; workspace: any },
  ) {
    const spaces = await this.spaceParticipantService.getSpacesByParticipant(
      req.workspaceMember._id,
      req.workspace._id,
      pagination,
    );

    return createSuccessResponse('Spaces retrieved successfully', spaces);
  }

  @Put(':spaceId')
  @UseGuards(SpaceParticipationGuard, SpaceAdminGuard)
  async updateSpace(
    @Param('spaceId') spaceId: string,
    @Body(new ZodValidationPipe(updateSpaceSchema))
    updateSpaceDto: UpdateSpaceDto,
    @Req() req: Request & { workspaceMember: any; workspace: any; space: any },
  ) {
    if (!Types.ObjectId.isValid(spaceId)) {
      throw new BadRequestException('Invalid space ID format');
    }

    const space = await this.spaceService.update(
      new Types.ObjectId(spaceId),
      updateSpaceDto,
      req.workspace._id,
    );

    return createSuccessResponse('Space updated successfully', space);
  }

  @Get(':spaceId')
  @UseGuards(SpaceParticipationGuard)
  async getSpaceDetails(
    @Param('spaceId') spaceId: string,
    @Req() req: Request & { workspaceMember: any; workspace: any; space: any },
  ) {
    if (!Types.ObjectId.isValid(spaceId)) {
      throw new BadRequestException('Invalid space ID format');
    }

    const spaceDetails = await this.spaceService.getSpaceDetails(
      new Types.ObjectId(spaceId),
      req.workspace._id,
    );

    return createSuccessResponse(
      'Space details retrieved successfully',
      spaceDetails,
    );
  }
}
