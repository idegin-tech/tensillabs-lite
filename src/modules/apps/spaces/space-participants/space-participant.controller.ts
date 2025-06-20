/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Post,
  Put,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { Types } from 'mongoose';
import { SpaceParticipantService } from './services/space-participant.service';
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
  inviteParticipantSchema,
  updateParticipantSchema,
  InviteParticipantDto,
  UpdateParticipantDto,
} from './dto/space-participant.dto';
import {
  paginationSchema,
  PaginationDto,
} from '../../../workspace-members/dto/pagination.dto';

@Controller('spaces/:spaceId/participants')
@UseGuards(AuthGuard, WorkspaceMemberGuard, SpaceParticipationGuard)
@RequirePermission(MemberPermissions.REGULAR)
export class SpaceParticipantController {
  constructor(
    private readonly spaceParticipantService: SpaceParticipantService,
  ) {}

  @Post()
  async inviteParticipant(
    @Param('spaceId') spaceId: string,
    @Body(new ZodValidationPipe(inviteParticipantSchema))
    inviteParticipantDto: InviteParticipantDto,
    @Req()
    req: Request & {
      workspaceMember: any;
      workspace: any;
      space: any;
    },
  ) {
    if (!Types.ObjectId.isValid(spaceId)) {
      throw new BadRequestException('Invalid space ID format');
    }

    const participant = await this.spaceParticipantService.inviteParticipant(
      new Types.ObjectId(spaceId),
      inviteParticipantDto,
      req.workspace._id,
    );

    return createSuccessResponse(
      'Participant invited successfully',
      participant,
    );
  }

  @Put(':participantId')
  @RequirePermission(MemberPermissions.MANAGER)
  async updateParticipant(
    @Param('participantId') participantId: string,
    @Body(new ZodValidationPipe(updateParticipantSchema))
    updateParticipantDto: UpdateParticipantDto,
    @Req()
    req: Request & {
      workspaceMember: any;
      workspace: any;
      space: any;
    },
  ) {
    if (!Types.ObjectId.isValid(participantId)) {
      throw new BadRequestException('Invalid participant ID format');
    }

    const participant = await this.spaceParticipantService.updateParticipant(
      new Types.ObjectId(participantId),
      updateParticipantDto,
      req.workspace._id,
    );

    return createSuccessResponse(
      'Participant updated successfully',
      participant,
    );
  }

  @Get()
  async getSpaceParticipants(
    @Param('spaceId') spaceId: string,
    @Query(new ZodValidationPipe(paginationSchema)) pagination: PaginationDto,
    @Req()
    req: Request & {
      workspaceMember: any;
      workspace: any;
      space: any;
    },
  ) {
    if (!Types.ObjectId.isValid(spaceId)) {
      throw new BadRequestException('Invalid space ID format');
    }

    const participants =
      await this.spaceParticipantService.getSpaceParticipants(
        new Types.ObjectId(spaceId),
        req.workspace._id,
        pagination,
      );

    return createSuccessResponse(
      'Participants retrieved successfully',
      participants,
    );
  }
}
