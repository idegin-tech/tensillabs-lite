import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HrmsUser, HrmsUserPermission } from '../hrms-user.schema';
import { Model } from 'mongoose';
import { Permission } from '../../../../workspace-members/schemas/workspace-member.schema';

export function validateHRMSUser(allowed: HrmsUserPermission[]) {
  @Injectable()
  class HRMSUserGuard implements CanActivate {
    constructor(
      @InjectModel(HrmsUser.name)
      public readonly hrmsUserModel: Model<HrmsUser>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const req = context.switchToHttp().getRequest<
        Request & {
          workspaceMember?: {
            _id?: string | Types.ObjectId;
            permission?: string;
          };
          workspace?: {
            _id?: string | Types.ObjectId;
          };
        }
      >();
      const member = req.workspaceMember;
      const workspace = req.workspace;
      if (!member || !workspace) {
        throw new ForbiddenException('Workspace member and workspace required');
      }

      const memberPermission =
        typeof member.permission === 'string' ? member.permission : undefined;
      if (
        memberPermission === Permission.ADMIN.toString() ||
        memberPermission === Permission.SUPER_ADMIN.toString()
      ) {
        return true;
      }

      const memberId = member._id
        ? typeof member._id === 'string'
          ? new Types.ObjectId(member._id)
          : member._id
        : undefined;
      const workspaceId = workspace._id
        ? typeof workspace._id === 'string'
          ? new Types.ObjectId(workspace._id)
          : workspace._id
        : undefined;
      if (!memberId || !workspaceId) {
        throw new ForbiddenException('Invalid member or workspace ID');
      }
      const hrmsUser = await this.hrmsUserModel.findOne({
        member: memberId,
        workspace: workspaceId,
      });
      if (!hrmsUser || !allowed.includes(hrmsUser.permission)) {
        throw new ForbiddenException('You do not have HRMS access');
      }
      return true;
    }
  }

  return HRMSUserGuard;
}
