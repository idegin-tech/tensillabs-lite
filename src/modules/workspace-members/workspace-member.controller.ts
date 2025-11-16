/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../auth/guards/auth.guard';
import { WorkspaceMemberService } from './services/workspace-member.service';
import { WorkspaceMemberGuard } from './guards/workspace-member.guard';
import { createSuccessResponse } from '../../lib/response.interface';
import { ZodValidationPipe } from '../../lib/validation.pipe';
import {
  inviteMemberSchema,
  InviteMemberDto,
  acceptInvitationSchema,
} from './dto/workspace-member.dto';
import { paginationSchema, PaginationDto } from './dto/pagination.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/schemas/user.schema';

@Controller('workspace-members')
@UseGuards(AuthGuard)
export class WorkspaceMemberController {
  constructor(
    private readonly workspaceMemberService: WorkspaceMemberService,
  ) {}

  @Get('workspace/all')
  @UseGuards(WorkspaceMemberGuard)
  @UsePipes(new ZodValidationPipe(paginationSchema))
  async getWorkspaceMembers(
    @Query() pagination: PaginationDto,
    @Req() req: Request & { workspaceMember: any; workspace: any },
  ) {
    const members = await this.workspaceMemberService.findByWorkspace(
      req.workspace.id,
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
    @CurrentUser() user: User,
  ) {
    console.log('my-memberships WAS CALLED', user.id);
    const memberships = await this.workspaceMemberService.findByUserEmail(
      user.email,
      pagination,
    );

    return createSuccessResponse(
      'User memberships retrieved successfully',
      memberships,
    );
  }

  @Post('invite')
  @UseGuards(WorkspaceMemberGuard)
  @UsePipes(new ZodValidationPipe(inviteMemberSchema))
  async inviteMember(
    @Body() inviteMemberDto: InviteMemberDto,
    @Req() req: Request & { workspaceMember: any; workspace: any },
  ) {
    const member = await this.workspaceMemberService.inviteMember(
      inviteMemberDto,
      req.workspace.id,
      req.workspaceMember,
    );

    return createSuccessResponse('Member invited successfully', member);
  }

  @Get('dependencies')
  @UseGuards(WorkspaceMemberGuard)
  async getMemberDependencies(
    @Req() req: Request & { workspaceMember: any; workspace: any },
  ) {
    const memberWithWorkspace =
      await this.workspaceMemberService.getMemberDependencies(
        req.workspaceMember.id,
      );

    return createSuccessResponse(
      'Member dependencies retrieved successfully',
      memberWithWorkspace,
    );
  }

  @Post('accept-invitation')
  async acceptInvitation(
    @Body() rawBody: any,
    @CurrentUser() user: User,
  ) {
    const validationResult = acceptInvitationSchema.safeParse(rawBody);
    if (!validationResult.success) {
      console.log('Validation failed:', validationResult.error);
      throw new BadRequestException(validationResult.error.errors);
    }

    const acceptInvitationDto = validationResult.data;

    const member = await this.workspaceMemberService.acceptInvitation(
      acceptInvitationDto.memberId,
      user.id,
    );

    return createSuccessResponse('Invitation accepted successfully', member);
  }
}
