/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { WorkspaceMemberService } from '../services/workspace-member.service';
import { WorkspaceService } from '../../workspaces/services/workspace.service';
import { MemberStatus } from '../schemas/workspace-member.schema';

@Injectable()
export class WorkspaceMemberGuard implements CanActivate {
  constructor(
    private readonly workspaceMemberService: WorkspaceMemberService,
    private readonly workspaceService: WorkspaceService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const memberId = request.headers['x-member-id'] as string;

    if (!memberId) {
      throw new BadRequestException('Member ID header is required');
    }

    try {
      const workspaceMember = await this.workspaceMemberService.findById(
        memberId,
      );

      if (!workspaceMember) {
        throw new UnauthorizedException('Workspace member not found');
      }

      if (workspaceMember.status !== MemberStatus.ACTIVE) {
        throw new UnauthorizedException('Workspace member is not active');
      }

      const workspace = await this.workspaceService.findWorkspaceById(
        workspaceMember.workspaceId,
      );

      if (!workspace) {
        throw new UnauthorizedException('Workspace not found');
      }

      (request as any).workspaceMember = workspaceMember;
      (request as any).workspace = workspace;

      return true;
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new UnauthorizedException('Invalid workspace member');
    }
  }
}
