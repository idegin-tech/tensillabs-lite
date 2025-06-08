/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  UsePipes,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { Types } from 'mongoose';
import { AuthGuard } from '../auth/guards/auth.guard';
import { WorkspaceMemberService } from './services/workspace-member.service';
import {
  WorkspaceMemberGuard,
  RequirePermission,
} from './guards/workspace-member.guard';
import { MemberPermissions } from './enums/member-permissions.enum';
import { createSuccessResponse } from '../../lib/response.interface';
import { ZodValidationPipe } from '../../lib/validation.pipe';
import {
  inviteMemberSchema,
  InviteMemberDto,
} from './dto/workspace-member.dto';
import { paginationSchema, PaginationDto } from './dto/pagination.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserDocument } from '../users/schemas/user.schema';

@Controller('workspace-members')
@UseGuards(AuthGuard)
export class WorkspaceMemberController {
  constructor(
    private readonly workspaceMemberService: WorkspaceMemberService,
  ) {}

  @Get('workspace/all')
  @UseGuards(WorkspaceMemberGuard)
  @RequirePermission(MemberPermissions.MANAGER)
  @UsePipes(new ZodValidationPipe(paginationSchema))
  async getWorkspaceMembers(
    @Query() pagination: PaginationDto,
    @Req() req: Request & { workspaceMember: any; workspace: any },
  ) {
    const members = await this.workspaceMemberService.findByWorkspace(
      req.workspace._id,
      pagination,
    );

    return createSuccessResponse(
      'Workspace members retrieved successfully',
      members,
    );
  }

  @Get('workspaces/me')
  async getMyMemberships(
    @Query(new ZodValidationPipe(paginationSchema)) pagination: PaginationDto,
    @CurrentUser() user: UserDocument,
  ) {
    console.log('my-memberships WAS CALLED', user._id);
    const memberships = await this.workspaceMemberService.findByUserId(
      user._id as Types.ObjectId,
      pagination,
    );

    return createSuccessResponse(
      'User memberships retrieved successfully',
      memberships,
    );
  }

  @Post('invite')
  @UseGuards(WorkspaceMemberGuard)
  @RequirePermission(MemberPermissions.MANAGER)
  @UsePipes(new ZodValidationPipe(inviteMemberSchema))
  async inviteMember(
    @Body() inviteMemberDto: InviteMemberDto,
    @Req() req: Request & { workspaceMember: any; workspace: any },
  ) {
    const member = await this.workspaceMemberService.inviteMember(
      inviteMemberDto,
      req.workspace._id,
      req.workspaceMember,
    );

    return createSuccessResponse('Member invited successfully', member);
  }
}
