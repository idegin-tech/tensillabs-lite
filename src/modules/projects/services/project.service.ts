import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Model,
  Types,
  PaginateModel,
  FilterQuery,
  PaginateResult,
} from 'mongoose';
import { Project, ProjectDocument } from '../schemas/project.schema';
import { CreateProjectDto, UpdateProjectDto } from '../dto/project.dto';
import { PaginationDto } from '../../workspace-members/dto/pagination.dto';
import { extractPaginationOptions } from '../../workspace-members/dto/pagination.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name)
    private projectModel: Model<ProjectDocument> &
      PaginateModel<ProjectDocument>,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    workspaceId: Types.ObjectId,
    createdBy: Types.ObjectId,
  ): Promise<ProjectDocument> {
    const projectData: Record<string, any> = {
      ...createProjectDto,
      workspace: workspaceId,
      createdBy,
    };

    if (createProjectDto.client) {
      projectData.client = new Types.ObjectId(createProjectDto.client);
    } else {
      delete projectData.client;
    }

    const project = new this.projectModel(projectData);

    return await project.save();
  }

  async findAll(
    workspaceId: Types.ObjectId,
    pagination: PaginationDto,
  ): Promise<PaginateResult<ProjectDocument>> {
    const { search, paginationOptions } = extractPaginationOptions(pagination);

    const query: FilterQuery<ProjectDocument> = {
      workspace: workspaceId,
      isDeleted: false,
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    return await this.projectModel.paginate(query, {
      ...paginationOptions,
      populate: ['createdBy', 'client'],
    });
  }

  async findById(id: Types.ObjectId): Promise<ProjectDocument> {
    const project = await this.projectModel
      .findById(id)
      .populate(['client', 'createdBy'])
      .exec();
    if (!project || project.isDeleted) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async update(
    id: Types.ObjectId,
    updateProjectDto: UpdateProjectDto,
    workspaceId: Types.ObjectId,
  ): Promise<ProjectDocument> {
    const updateData: Record<string, any> = { ...updateProjectDto };

    if (updateProjectDto.client) {
      updateData.client = new Types.ObjectId(updateProjectDto.client);
    } else if (
      updateProjectDto.client === null ||
      updateProjectDto.client === ''
    ) {
      updateData.client = null;
    }

    const project = await this.projectModel
      .findOneAndUpdate(
        { _id: id, workspace: workspaceId, isDeleted: false },
        updateData,
        { new: true },
      )
      .populate(['client', 'createdBy'])
      .exec();

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }
}
