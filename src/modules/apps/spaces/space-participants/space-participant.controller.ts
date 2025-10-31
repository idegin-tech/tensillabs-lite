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
} from '@nestjs/common';
import { Request } from 'express';
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
    const participant = await this.spaceParticipantService.inviteParticipant(
      spaceId,
      inviteParticipantDto,
      req.workspace.id,
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
    const participant = await this.spaceParticipantService.updateParticipant(
      participantId,
      updateParticipantDto,
      req.workspace.id,
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
    const participants =
      await this.spaceParticipantService.getSpaceParticipants(
        spaceId,
        req.workspace.id,
        pagination,
      );

    return createSuccessResponse(
      'Participants retrieved successfully',
      participants,
    );
  }
}
