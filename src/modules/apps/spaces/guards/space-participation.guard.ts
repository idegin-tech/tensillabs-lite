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
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Request } from 'express';
import {
  SpaceParticipant,
  SpaceParticipantDocument,
  ParticipantStatus,
} from '../space-participants/schemas/space-participant.schema';
import { List, ListDocument } from '../lists/schemas/list.schema';
import { Space, SpaceDocument } from '../schemas/space.schema';

@Injectable()
export class SpaceParticipationGuard implements CanActivate {
  constructor(
    @InjectModel(SpaceParticipant.name)
    private spaceParticipantModel: Model<SpaceParticipantDocument>,
    @InjectModel(List.name)
    private listModel: Model<ListDocument>,
    @InjectModel(Space.name)
    private spaceModel: Model<SpaceDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const { spaceId, listId } = request.params;
    const workspaceMember = (request as any).workspaceMember;
    const workspace = (request as any).workspace;

    if (!workspaceMember || !workspace) {
      throw new ForbiddenException('Workspace member context required');
    }

    let targetSpaceId: Types.ObjectId;

    if (spaceId) {
      if (!Types.ObjectId.isValid(spaceId)) {
        throw new BadRequestException('Invalid space ID format');
      }
      targetSpaceId = new Types.ObjectId(spaceId);

      const space = await this.spaceModel.findById(targetSpaceId).exec();
      if (!space) {
        throw new NotFoundException('Space not found');
      }
      (request as any).space = space;
    } else if (listId) {
      if (!Types.ObjectId.isValid(listId)) {
        throw new BadRequestException('Invalid list ID format');
      }

      const list = await this.listModel.findById(listId).exec();
      if (!list) {
        throw new NotFoundException('List not found');
      }

      targetSpaceId = list.space;
      const space = await this.spaceModel.findById(targetSpaceId).exec();
      if (!space) {
        throw new NotFoundException('Space not found');
      }

      (request as any).list = list;
      (request as any).space = space;
    } else {
      throw new BadRequestException('Either spaceId or listId is required');
    }

    const participant = await this.spaceParticipantModel
      .findOne({
        space: targetSpaceId,
        member: workspaceMember._id,
        workspace: workspace._id,
        status: ParticipantStatus.ACTIVE,
      })
      .exec();

    if (!participant) {
      throw new ForbiddenException(
        'Access denied: Not a participant of this space',
      );
    }

    (request as any).spaceParticipant = participant;
    return true;
  }
}
