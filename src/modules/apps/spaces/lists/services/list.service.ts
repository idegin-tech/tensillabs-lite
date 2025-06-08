import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { List, ListDocument } from '../schemas/list.schema';
import {
  SpaceParticipant,
  SpaceParticipantDocument,
  ParticipantStatus,
} from '../../space-participants/schemas/space-participant.schema';

@Injectable()
export class ListService {
  constructor(
    @InjectModel(List.name)
    private listModel: Model<ListDocument>,
    @InjectModel(SpaceParticipant.name)
    private spaceParticipantModel: Model<SpaceParticipantDocument>,
  ) {}

  async getListsBySpace(
    spaceId: Types.ObjectId,
    workspaceId: Types.ObjectId,
    currentMemberId: Types.ObjectId,
  ): Promise<ListDocument[]> {
    await this.verifySpaceParticipation(spaceId, currentMemberId, workspaceId);

    return await this.listModel
      .find({
        space: spaceId,
        workspace: workspaceId,
        isDeleted: false,
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  private async verifySpaceParticipation(
    spaceId: Types.ObjectId,
    memberId: Types.ObjectId,
    workspaceId: Types.ObjectId,
  ): Promise<void> {
    const participant = await this.spaceParticipantModel
      .findOne({
        space: spaceId,
        member: memberId,
        workspace: workspaceId,
        status: ParticipantStatus.ACTIVE,
      })
      .exec();

    if (!participant) {
      throw new ForbiddenException(
        'Access denied: Not a participant of this space',
      );
    }
  }
}
