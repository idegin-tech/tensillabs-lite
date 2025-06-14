/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Model,
  Types,
  PaginateModel,
  PaginateResult,
  FilterQuery,
} from 'mongoose';
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
import {
  PaginationDto,
  extractPaginationOptions,
} from '../../../../workspace-members/dto/pagination.dto';

@Injectable()
export class SpaceParticipantService {
  constructor(
    @InjectModel(SpaceParticipant.name)
    private spaceParticipantModel: Model<SpaceParticipantDocument> &
      PaginateModel<SpaceParticipantDocument>,
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
  ): Promise<SpaceParticipantDocument> {
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
  ): Promise<SpaceParticipantDocument> {
    const participant = await this.spaceParticipantModel
      .findOne({
        _id: participantId,
        workspace: workspaceId,
        status: ParticipantStatus.ACTIVE,
      })
      .exec();

    if (!participant) {
      throw new NotFoundException('Participant not found');
    }

    return await this.spaceParticipantModel
      .findOneAndUpdate(
        { _id: participantId, workspace: workspaceId },
        updateParticipantDto,
        { new: true },
      )
      .exec();
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

  async getSpacesByParticipant(
    memberId: Types.ObjectId,
    workspaceId: Types.ObjectId,
    pagination?: PaginationDto,
  ): Promise<PaginateResult<SpaceParticipantDocument>> {
    if (!pagination) {
      pagination = { page: 1, limit: 30, sortBy: '-createdAt' };
    }

    const { search, paginationOptions } = extractPaginationOptions(pagination);

    const query: FilterQuery<SpaceParticipantDocument> = {
      member: memberId,
      workspace: workspaceId,
      status: ParticipantStatus.ACTIVE,
    };

    if (search) {
      const spaceIds = await this.spaceModel
        .find({
          workspace: workspaceId,
          isDeleted: false,
          name: { $regex: search, $options: 'i' },
        })
        .select('_id')
        .exec();

      if (spaceIds.length > 0) {
        query.space = { $in: spaceIds.map((s) => s._id) };
      } else {
        query.space = null;
      }
    }

    const result = await this.spaceParticipantModel.paginate(query, {
      ...paginationOptions,
      populate: [
        {
          path: 'space',
          select: 'name description color icon isPublic createdAt',
          match: { isDeleted: false },
        },
      ],
    });

    const enhancedDocs = await Promise.all(
      result.docs.map(async (doc) => {
        if (!doc.space) return doc;

        const spaceId = (doc.space as any)._id;

        const [participantCount, recentParticipants, listCount] =
          await Promise.all([
            this.spaceParticipantModel.countDocuments({
              space: spaceId,
              workspace: workspaceId,
              status: ParticipantStatus.ACTIVE,
            }),
            this.spaceParticipantModel
              .find({
                space: spaceId,
                workspace: workspaceId,
                status: ParticipantStatus.ACTIVE,
              })
              .populate('member', 'firstName lastName primaryEmail')
              .sort({ createdAt: -1 })
              .limit(5)
              .exec(),
            this.spaceModel.db.collection('lists').countDocuments({
              space: spaceId,
              workspace: workspaceId,
              isDeleted: false,
            }),
          ]);

        const docObj = doc.toObject();
        return {
          ...docObj,
          space: {
            ...(docObj.space as any),
            participantCount,
            recentParticipants: recentParticipants.map((p: any) => ({
              _id: p.member._id,
              firstName: p.member.firstName,
              lastName: p.member.lastName,
              primaryEmail: p.member.primaryEmail,
            })),
            listCount,
          },
        };
      }),
    );

    return {
      ...result,
      docs: enhancedDocs as any,
    };
  }
}
