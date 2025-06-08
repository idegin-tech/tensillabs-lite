import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Model,
  Types,
  PaginateModel,
  FilterQuery,
  PaginateResult,
} from 'mongoose';
import { Team, TeamDocument } from '../schemas/team.schema';
import { CreateTeamDto, UpdateTeamDto } from '../dto/team.dto';
import {
  PaginationDto,
  extractPaginationOptions,
} from '../../../workspace-members/dto/pagination.dto';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(Team.name)
    private teamModel: Model<TeamDocument> & PaginateModel<TeamDocument>,
  ) {}

  async create(
    createTeamDto: CreateTeamDto,
    workspaceId: Types.ObjectId,
    createdBy: Types.ObjectId,
  ): Promise<TeamDocument> {
    const team = new this.teamModel({
      ...createTeamDto,
      workspace: workspaceId,
      createdBy,
    });

    return await team.save();
  }

  async findAll(
    workspaceId: Types.ObjectId,
    pagination: PaginationDto,
  ): Promise<PaginateResult<TeamDocument>> {
    const { search, paginationOptions } = extractPaginationOptions(pagination);

    const query: FilterQuery<TeamDocument> = {
      workspace: workspaceId,
      isDeleted: false,
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    return await this.teamModel.paginate(query, {
      ...paginationOptions,
      populate: 'createdBy',
    });
  }

  async findById(id: Types.ObjectId): Promise<TeamDocument> {
    const team = await this.teamModel.findById(id).exec();
    if (!team || team.isDeleted) {
      throw new NotFoundException('Team not found');
    }
    return team;
  }

  async update(
    id: Types.ObjectId,
    updateTeamDto: UpdateTeamDto,
  ): Promise<TeamDocument> {
    const team = await this.teamModel
      .findByIdAndUpdate(id, updateTeamDto, { new: true })
      .exec();

    if (!team || team.isDeleted) {
      throw new NotFoundException('Team not found');
    }

    return team;
  }

  async moveToTrash(id: Types.ObjectId): Promise<TeamDocument> {
    const team = await this.teamModel
      .findByIdAndUpdate(id, { isDeleted: true }, { new: true })
      .exec();

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    return team;
  }

  async toggleActive(
    id: Types.ObjectId,
    isActive: boolean,
  ): Promise<TeamDocument> {
    const team = await this.teamModel
      .findByIdAndUpdate(id, { isActive }, { new: true })
      .exec();

    if (!team || team.isDeleted) {
      throw new NotFoundException('Team not found');
    }

    return team;
  }
}
