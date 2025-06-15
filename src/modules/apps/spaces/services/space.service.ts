import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Space, SpaceDocument } from '../schemas/space.schema';
import { CreateSpaceDto, UpdateSpaceDto } from '../dto/space.dto';
import { SpaceParticipantService } from '../space-participants/services/space-participant.service';

@Injectable()
export class SpaceService {
  constructor(
    @InjectModel(Space.name)
    private spaceModel: Model<SpaceDocument>,
    private spaceParticipantService: SpaceParticipantService,
  ) {}

  async create(
    createSpaceDto: CreateSpaceDto,
    workspaceId: Types.ObjectId,
    createdBy: Types.ObjectId,
  ): Promise<SpaceDocument> {
    const space = new this.spaceModel({
      ...createSpaceDto,
      workspace: workspaceId,
      createdBy,
    });

    const savedSpace = await space.save();

    await this.spaceParticipantService.initializeDefaultParticipant(
      savedSpace._id as Types.ObjectId,
      createdBy,
      workspaceId,
    );

    return savedSpace;
  }

  async update(
    spaceId: Types.ObjectId,
    updateSpaceDto: UpdateSpaceDto,
    workspaceId: Types.ObjectId,
  ): Promise<SpaceDocument> {
    const space = await this.spaceModel
      .findOneAndUpdate(
        { _id: spaceId, workspace: workspaceId, isDeleted: false },
        updateSpaceDto,
        { new: true },
      )
      .exec();

    if (!space) {
      throw new NotFoundException('Space not found');
    }

    return space;
  }

  async getSpaceDetails(
    spaceId: Types.ObjectId,
    workspaceId: Types.ObjectId,
  ): Promise<any> {
    const space = await this.spaceModel
      .findOne({ _id: spaceId, workspace: workspaceId, isDeleted: false })
      .exec();

    if (!space) {
      throw new NotFoundException('Space not found');
    }

    const [lists, recentParticipants] = await Promise.all([
      this.spaceModel.db
        .collection('lists')
        .find({
          space: spaceId,
          workspace: workspaceId,
          isDeleted: false,
        })
        .sort({ createdAt: -1 })
        .toArray(),
      this.spaceParticipantService.getSpaceParticipants(spaceId, workspaceId),
    ]);

    return {
      space: space.toObject(),
      lists: lists.map((list) => ({
        _id: list._id,
        name: list.name,
        isPrivate: list.isPrivate,
        createdAt: list.createdAt,
        updatedAt: list.updatedAt,
      })),
      recentParticipants: recentParticipants.slice(0, 20).map((p: any) => ({
        _id: p.member._id,
        firstName: p.member.firstName,
        lastName: p.member.lastName,
        primaryEmail: p.member.primaryEmail,
        role: p.role,
        status: p.status,
        joinedAt: p.createdAt,
      })),
    };
  }
}
