/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import {
  SpaceParticipant,
  ParticipantStatus,
} from '../space-participants/schemas/space-participant.schema';
import { List } from '../lists/schemas/list.schema';
import { Space } from '../schemas/space.schema';

@Injectable()
export class SpaceParticipationGuard implements CanActivate {
  constructor(
    @InjectRepository(SpaceParticipant)
    private spaceParticipantRepository: Repository<SpaceParticipant>,
    @InjectRepository(List)
    private listRepository: Repository<List>,
    @InjectRepository(Space)
    private spaceRepository: Repository<Space>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const { spaceId, listId } = request.params;
    const workspaceMember = (request as any).workspaceMember;
    const workspace = (request as any).workspace;

    if (!workspaceMember || !workspace) {
      throw new ForbiddenException('Workspace member context required');
    }

    let targetSpaceId: string;

    if (spaceId) {
      targetSpaceId = spaceId;

      const space = await this.spaceRepository.findOne({
        where: { id: targetSpaceId },
      });
      if (!space) {
        throw new NotFoundException('Space not found');
      }
      (request as any).space = space;
    } else if (listId) {
      const list = await this.listRepository.findOne({
        where: { id: listId },
      });
      if (!list) {
        throw new NotFoundException('List not found');
      }

      targetSpaceId = list.spaceId;
      const space = await this.spaceRepository.findOne({
        where: { id: targetSpaceId },
      });
      if (!space) {
        throw new NotFoundException('Space not found');
      }

      (request as any).list = list;
      (request as any).space = space;
    } else {
      throw new BadRequestException('Either spaceId or listId is required');
    }

    const participant = await this.spaceParticipantRepository.findOne({
      where: {
        spaceId: targetSpaceId,
        memberId: workspaceMember.id,
        workspaceId: workspace.id,
        status: ParticipantStatus.ACTIVE,
      },
    });

    if (!participant) {
      throw new ForbiddenException(
        'Access denied: Not a participant of this space',
      );
    }

    (request as any).spaceParticipant = participant;
    return true;
  }
}
