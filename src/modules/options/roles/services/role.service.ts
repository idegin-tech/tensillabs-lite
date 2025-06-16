/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Model,
  Types,
  PaginateModel,
  FilterQuery,
  PaginateResult,
} from 'mongoose';
import { Role, RoleDocument } from '../schemas/role.schema';
import { CreateRoleDto, UpdateRoleDto } from '../dto/role.dto';
import {
  PaginationDto,
  extractPaginationOptions,
} from '../../../workspace-members/dto/pagination.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: Model<RoleDocument> & PaginateModel<RoleDocument>,
  ) {}

  async create(
    createRoleDto: CreateRoleDto,
    workspaceId: Types.ObjectId,
    createdBy: Types.ObjectId,
  ): Promise<RoleDocument> {
    const role = new this.roleModel({
      ...createRoleDto,
      workspace: workspaceId,
      createdBy,
    });

    return await role.save();
  }

  async findAll(
    workspaceId: Types.ObjectId,
    pagination: PaginationDto,
  ): Promise<PaginateResult<RoleDocument>> {
    const { search, isActive, paginationOptions } =
      extractPaginationOptions(pagination);

    const query: FilterQuery<RoleDocument> = {
      workspace: workspaceId,
      isDeleted: false,
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (isActive && isActive !== 'all') {
      query.isActive = isActive === 'true';
    }

    return await this.roleModel.paginate(query, {
      ...paginationOptions,
      populate: 'createdBy',
    });
  }

  async findById(id: Types.ObjectId): Promise<RoleDocument> {
    const role = await this.roleModel.findById(id).exec();
    if (!role || role.isDeleted) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  async update(
    id: Types.ObjectId,
    updateRoleDto: UpdateRoleDto,
    workspaceId: Types.ObjectId,
  ): Promise<RoleDocument> {
    const role = await this.roleModel
      .findOneAndUpdate(
        { _id: id, workspace: workspaceId, isDeleted: false },
        updateRoleDto,
        { new: true },
      )
      .populate('createdBy')
      .exec();

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  async moveToTrash(
    id: Types.ObjectId,
    workspaceId: Types.ObjectId,
  ): Promise<RoleDocument> {
    const role = await this.roleModel
      .findOneAndUpdate(
        { _id: id, workspace: workspaceId, isDeleted: false },
        { isDeleted: true },
        { new: true },
      )
      .exec();

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  async toggleActive(
    id: Types.ObjectId,
    isActive: boolean,
    workspaceId: Types.ObjectId,
  ): Promise<RoleDocument> {
    const role = await this.roleModel
      .findOneAndUpdate(
        { _id: id, workspace: workspaceId, isDeleted: false },
        { isActive },
        { new: true },
      )
      .populate('createdBy')
      .exec();

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }
}
