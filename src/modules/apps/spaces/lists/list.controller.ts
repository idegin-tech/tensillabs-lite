/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { Types } from 'mongoose';
import { ListService } from './services/list.service';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import {
  WorkspaceMemberGuard,
  RequirePermission,
} from '../../../workspace-members/guards/workspace-member.guard';
import { MemberPermissions } from '../../../workspace-members/enums/member-permissions.enum';
import { SpaceParticipationGuard } from '../guards/space-participation.guard';
import { createSuccessResponse } from '../../../../lib/response.interface';

@Controller('spaces/:spaceId/lists')
@UseGuards(AuthGuard, WorkspaceMemberGuard, SpaceParticipationGuard)
@RequirePermission(MemberPermissions.REGULAR)
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Get()
  async getListsBySpace(
    @Param('spaceId') spaceId: string,
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

    const lists = await this.listService.getListsBySpace(
      new Types.ObjectId(spaceId),
      req.workspace._id,
    );

    return createSuccessResponse('Lists retrieved successfully', lists);
  }
}
