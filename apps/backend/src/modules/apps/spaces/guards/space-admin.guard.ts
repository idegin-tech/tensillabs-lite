import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { SpacePermission } from '../space-participants/schemas/space-participant.schema';

interface RequestWithSpaceParticipant extends Request {
  spaceParticipant?: {
    permissions: SpacePermission;
    [key: string]: unknown;
  };
}

@Injectable()
export class SpaceAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<RequestWithSpaceParticipant>();
    const spaceParticipant = request.spaceParticipant;

    if (!spaceParticipant) {
      throw new ForbiddenException('Space participant context required');
    }

    if (spaceParticipant.permissions !== SpacePermission.ADMIN) {
      throw new ForbiddenException(
        'Only admin participants can perform this action',
      );
    }

    return true;
  }
}
