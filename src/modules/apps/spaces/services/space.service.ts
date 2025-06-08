import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Space, SpaceDocument } from '../schemas/space.schema';
import { CreateSpaceDto } from '../dto/space.dto';
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
}
