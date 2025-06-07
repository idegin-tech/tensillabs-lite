import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { Types } from 'mongoose';
import { WorkspaceMemberService } from '../services/workspace-member.service';
import { WorkspaceService } from '../../workspaces/services/workspace.service';
import { Permission } from '../schemas/workspace-member.schema';

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

    if (!Types.ObjectId.isValid(memberId)) {
      throw new BadRequestException('Invalid member ID format');
    }

    try {
      const workspaceMember = await this.workspaceMemberService.findById(
        new Types.ObjectId(memberId),
      );

      if (!workspaceMember) {
        throw new UnauthorizedException('Workspace member not found');
      }

      const workspace = await this.workspaceService.findWorkspaceById(
        workspaceMember.workspace.toString(),
      );

      if (!workspace) {
        throw new UnauthorizedException('Workspace not found');
      }

      const hasPermission = await this.workspaceMemberService.checkPermission(
        workspaceMember.user,
        workspaceMember.workspace,
        [Permission.SUPER_ADMIN, Permission.ADMIN, Permission.MANAGER],
      );

      if (!hasPermission) {
        throw new UnauthorizedException(
          'Insufficient permissions to invite members',
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (request as any).workspaceMember = workspaceMember;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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
