import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  SpaceParticipant,
  SpaceParticipantDocument,
  SpaceRole,
  ParticipantStatus,
} from '../schemas/space-participant.schema';
import {
  InviteParticipantDto,
  UpdateParticipantDto,
} from '../dto/space-participant.dto';
import { Space, SpaceDocument } from '../../schemas/space.schema';

@Injectable()
export class SpaceParticipantService {
  constructor(
    @InjectModel(SpaceParticipant.name)
    private spaceParticipantModel: Model<SpaceParticipantDocument>,
    @InjectModel(Space.name)
    private spaceModel: Model<SpaceDocument>,
  ) {}

  async initializeDefaultParticipant(
    spaceId: Types.ObjectId,
    memberId: Types.ObjectId,
    workspaceId: Types.ObjectId,
  ): Promise<SpaceParticipantDocument> {
    const participant = new this.spaceParticipantModel({
      space: spaceId,
      member: memberId,
      workspace: workspaceId,
      role: SpaceRole.ADMIN,
      status: ParticipantStatus.ACTIVE,
    });

    return await participant.save();
  }

  async inviteParticipant(
    spaceId: Types.ObjectId,
    inviteParticipantDto: InviteParticipantDto,
    workspaceId: Types.ObjectId,
    currentMemberId: Types.ObjectId,
  ): Promise<SpaceParticipantDocument> {
    const currentParticipant = await this.spaceParticipantModel
      .findOne({
        space: spaceId,
        member: currentMemberId,
        workspace: workspaceId,
        status: ParticipantStatus.ACTIVE,
      })
      .exec();

    if (!currentParticipant || currentParticipant.role !== SpaceRole.ADMIN) {
      throw new ForbiddenException(
        'Only admin participants can invite members',
      );
    }

    const existingParticipant = await this.spaceParticipantModel
      .findOne({
        space: spaceId,
        member: new Types.ObjectId(inviteParticipantDto.memberId),
        workspace: workspaceId,
      })
      .exec();

    if (existingParticipant) {
      throw new ForbiddenException('Member is already a participant');
    }

    const participant = new this.spaceParticipantModel({
      space: spaceId,
      member: new Types.ObjectId(inviteParticipantDto.memberId),
      workspace: workspaceId,
      role: SpaceRole.REGULAR,
      status: ParticipantStatus.ACTIVE,
    });

    return await participant.save();
  }

  async updateParticipant(
    participantId: Types.ObjectId,
    updateParticipantDto: UpdateParticipantDto,
    workspaceId: Types.ObjectId,
    currentMemberId: Types.ObjectId,
  ): Promise<SpaceParticipantDocument> {
    const participant = await this.spaceParticipantModel
      .findById(participantId)
      .exec();

    if (!participant) {
      throw new NotFoundException('Participant not found');
    }

    const currentParticipant = await this.spaceParticipantModel
      .findOne({
        space: participant.space,
        member: currentMemberId,
        workspace: workspaceId,
        status: ParticipantStatus.ACTIVE,
      })
      .exec();

    if (!currentParticipant || currentParticipant.role !== SpaceRole.ADMIN) {
      throw new ForbiddenException(
        'Only admin participants can update members',
      );
    }

    const isSpaceOwner = await this.isSpaceOwner(
      participant.space,
      participant.member,
    );

    if (isSpaceOwner) {
      throw new ForbiddenException('Space owner data cannot be updated');
    }

    return await this.spaceParticipantModel
      .findByIdAndUpdate(participantId, updateParticipantDto, { new: true })
      .exec();
  }

  private async isSpaceOwner(
    spaceId: Types.ObjectId,
    memberId: Types.ObjectId,
  ): Promise<boolean> {
    const space = await this.spaceModel
      .findById(spaceId)
      .select('createdBy')
      .exec();

    return space?.createdBy.equals(memberId) || false;
  }

  async getSpaceParticipants(
    spaceId: Types.ObjectId,
    workspaceId: Types.ObjectId,
  ): Promise<SpaceParticipantDocument[]> {
    return await this.spaceParticipantModel
      .find({
        space: spaceId,
        workspace: workspaceId,
        status: ParticipantStatus.ACTIVE,
      })
      .populate('member', 'firstName lastName primaryEmail')
      .exec();
  }
}
