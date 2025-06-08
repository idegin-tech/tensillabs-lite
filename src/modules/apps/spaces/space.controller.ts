/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  //   BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { Types } from 'mongoose';
import { SpaceService } from './services/space.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import {
  WorkspaceMemberGuard,
  RequirePermission,
} from '../../workspace-members/guards/workspace-member.guard';
import { MemberPermissions } from '../../workspace-members/enums/member-permissions.enum';
import { createSuccessResponse } from '../../../lib/response.interface';
import { ZodValidationPipe } from '../../../lib/validation.pipe';
import { createSpaceSchema, CreateSpaceDto } from './dto/space.dto';

@Controller('spaces')
@UseGuards(AuthGuard, WorkspaceMemberGuard)
@RequirePermission(MemberPermissions.REGULAR)
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

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
}
