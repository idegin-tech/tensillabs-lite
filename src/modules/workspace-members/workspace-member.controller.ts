import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UsePipes,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { Types } from 'mongoose';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserDocument } from '../users/schemas/user.schema';
import { WorkspaceMemberService } from './services/workspace-member.service';
import { WorkspaceMemberGuard } from './guards/workspace-member.guard';
import { createSuccessResponse } from '../../lib/response.interface';
import { ZodValidationPipe } from '../../lib/validation.pipe';
import {
  inviteMemberSchema,
  InviteMemberDto,
} from './dto/workspace-member.dto';

@Controller('workspace-members')
@UseGuards(AuthGuard)
export class WorkspaceMemberController {
  constructor(
    private readonly workspaceMemberService: WorkspaceMemberService,
  ) {}

  @Get('me')
  async getMyWorkspaceMembers(@CurrentUser() user: UserDocument) {
    const members = await this.workspaceMemberService.findByUser(
      user._id as Types.ObjectId,
    );

    return createSuccessResponse(
      'Workspace members retrieved successfully',
      members,
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      req.workspace._id,
      req.workspaceMember,
    );

    return createSuccessResponse('Member invited successfully', member);
  }
}
