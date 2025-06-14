import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { SpaceRole } from '../space-participants/schemas/space-participant.schema';

@Injectable()
export class SpaceAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const spaceParticipant = (request as any).spaceParticipant;

    if (!spaceParticipant) {
      throw new ForbiddenException('Space participant context required');
    }

    if (spaceParticipant.role !== SpaceRole.ADMIN) {
      throw new ForbiddenException(
        'Only admin participants can perform this action',
      );
    }

    return true;
  }
}
