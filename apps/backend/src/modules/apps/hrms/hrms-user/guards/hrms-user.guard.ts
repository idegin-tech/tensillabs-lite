import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { HrmsUser, HrmsUserPermission } from '../hrms-user.schema';
import { Repository } from 'typeorm';

export function validateHRMSUser(allowed: HrmsUserPermission[]) {
  @Injectable()
  class HRMSUserGuard implements CanActivate {
    constructor(
      @InjectRepository(HrmsUser)
      public readonly hrmsUserRepository: Repository<HrmsUser>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const req = context.switchToHttp().getRequest<
        Request & {
          workspaceMember?: {
            id?: string;
          };
          workspace?: {
            id?: string;
          };
        }
      >();
      const member = req.workspaceMember;
      const workspace = req.workspace;
      if (!member || !workspace) {
        throw new ForbiddenException('Workspace member and workspace required');
      }

      const memberId = member.id;
      const workspaceId = workspace.id;
      if (!memberId || !workspaceId) {
        throw new ForbiddenException('Invalid member or workspace ID');
      }
      const hrmsUser = await this.hrmsUserRepository.findOne({
        where: {
          memberId: memberId,
          workspaceId: workspaceId,
        },
      });
      if (!hrmsUser || !allowed.includes(hrmsUser.permission)) {
        throw new ForbiddenException('You do not have HRMS access');
      }
      return true;
    }
  }

  return HRMSUserGuard;
}
