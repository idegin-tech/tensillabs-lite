/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Types } from 'mongoose';
import { WorkspaceMemberService } from '../services/workspace-member.service';
import { WorkspaceService } from '../../workspaces/services/workspace.service';
import { MemberStatus } from '../schemas/workspace-member.schema';
import {
  MemberPermissions,
  PermissionHierarchy,
} from '../enums/member-permissions.enum';

export const RequirePermission = (permission: MemberPermissions) =>
  SetMetadata('requiredPermission', permission);

@Injectable()
export class WorkspaceMemberGuard implements CanActivate {
  constructor(
    private readonly workspaceMemberService: WorkspaceMemberService,
    private readonly workspaceService: WorkspaceService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const memberId = request.headers['x-member-id'] as string;

    const requiredPermission = this.reflector.get<MemberPermissions>(
      'requiredPermission',
      context.getHandler(),
    );

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

      if (workspaceMember.status !== MemberStatus.ACTIVE) {
        throw new UnauthorizedException('Workspace member is not active');
      }

      const workspace = await this.workspaceService.findWorkspaceById(
        workspaceMember.workspace.toString(),
      );

      if (!workspace) {
        throw new UnauthorizedException('Workspace not found');
      }

      if (PermissionHierarchy.isSuperAdmin(workspaceMember.permission)) {
        (request as any).workspaceMember = workspaceMember;
        (request as any).workspace = workspace;
        return true;
      }

      if (requiredPermission) {
        const hasPermission = PermissionHierarchy.hasPermission(
          workspaceMember.permission,
          requiredPermission,
        );

        if (!hasPermission) {
          throw new UnauthorizedException(
            `Insufficient permissions. Required: ${requiredPermission}`,
          );
        }
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
