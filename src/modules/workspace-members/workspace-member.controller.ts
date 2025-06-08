/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  UsePipes,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { Types } from 'mongoose';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserDocument } from '../users/schemas/user.schema';
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

@Controller('workspace-members')
@UseGuards(AuthGuard)
export class WorkspaceMemberController {
  constructor(
    private readonly workspaceMemberService: WorkspaceMemberService,
  ) {}

  @Get('me/all')
  async getMyWorkspaceMembers(@CurrentUser() user: UserDocument) {
    const members = await this.workspaceMemberService.findByUser(
      user._id as Types.ObjectId,
    );

    return createSuccessResponse(
      'Workspace members retrieved successfully',
      members,
    );
  }

  @Get('workspace/:workspaceId')
  @UseGuards(WorkspaceMemberGuard)
  @RequirePermission(MemberPermissions.MANAGER)
  @UsePipes(new ZodValidationPipe(paginationSchema))
  async getWorkspaceMembers(
    @Param('workspaceId') workspaceId: string,
    @Query() pagination: PaginationDto,
  ) {
    if (!Types.ObjectId.isValid(workspaceId)) {
      throw new BadRequestException('Invalid workspace ID format');
    }

    const members = await this.workspaceMemberService.findByWorkspace(
      new Types.ObjectId(workspaceId),
      pagination,
    );

    return createSuccessResponse(
      'Workspace members retrieved successfully',
      members,
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
