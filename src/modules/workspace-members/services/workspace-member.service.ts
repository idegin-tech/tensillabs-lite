/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Model,
  Types,
  PaginateModel,
  FilterQuery,
  PaginateResult,
  PipelineStage,
} from 'mongoose';
import {
  WorkspaceMember,
  WorkspaceMemberDocument,
  Permission,
  MemberStatus,
} from '../schemas/workspace-member.schema';
import { InviteMemberDto } from '../dto/workspace-member.dto';
import { PaginationDto, extractPaginationOptions } from '../dto/pagination.dto';

@Injectable()
export class WorkspaceMemberService {
  constructor(
    @InjectModel(WorkspaceMember.name)
    private workspaceMemberModel: Model<WorkspaceMemberDocument> &
      PaginateModel<WorkspaceMemberDocument>,
  ) {}

  async initializeWorkspaceOwner(
    userId: Types.ObjectId,
    workspaceId: Types.ObjectId,
    userEmail: string,
    firstName: string,
    lastName: string,
    middleName?: string,
  ): Promise<WorkspaceMemberDocument> {
    const workspaceMember = new this.workspaceMemberModel({
      user: userId,
      workspace: workspaceId,
      firstName,
      middleName: middleName || null,
      lastName,
      primaryEmail: userEmail,
      permission: Permission.SUPER_ADMIN,
      status: MemberStatus.ACTIVE,
      lastActiveAt: new Date(),
    });

    return await workspaceMember.save();
  }

  async findByUserAndWorkspace(
    userId: Types.ObjectId,
    workspaceId: Types.ObjectId,
  ): Promise<WorkspaceMemberDocument | null> {
    return await this.workspaceMemberModel
      .findOne({ user: userId, workspace: workspaceId })
      .exec();
  }

  async findByWorkspace(
    workspaceId: Types.ObjectId,
    pagination?: PaginationDto,
  ): Promise<PaginateResult<WorkspaceMemberDocument>> {
    if (!pagination) {
      pagination = { page: 1, limit: 10, sortBy: '-createdAt' };
    }

    const { search, status, permission, paginationOptions } =
      extractPaginationOptions(pagination);

    const query: FilterQuery<WorkspaceMemberDocument> = {
      workspace: workspaceId,
    };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (permission && permission !== 'all') {
      query.permission = permission;
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { primaryEmail: { $regex: search, $options: 'i' } },
      ];
    }

    const restPaginationOptions = { ...paginationOptions };
    delete restPaginationOptions.populate;

    return await this.workspaceMemberModel.paginate(query, {
      ...restPaginationOptions,
      populate: { path: 'user', select: 'email timezone isEmailVerified' },
    });
  }

  async updateMember(
    memberId: Types.ObjectId,
    updateData: Partial<WorkspaceMember>,
  ): Promise<WorkspaceMemberDocument | null> {
    return await this.workspaceMemberModel
      .findByIdAndUpdate(memberId, updateData, { new: true })
      .exec();
  }

  async findById(
    memberId: Types.ObjectId,
  ): Promise<WorkspaceMemberDocument | null> {
    return await this.workspaceMemberModel.findById(memberId).exec();
  }

  async getMemberDependencies(memberId: Types.ObjectId): Promise<any> {
    const member = await this.workspaceMemberModel
      .findById(memberId)
      .populate({
        path: 'user',
        select: 'email timezone isEmailVerified lastLoginAt',
      })
      .exec();

    if (!member) {
      return null;
    }

    const workspace = await this.workspaceMemberModel.db
      .collection('workspaces')
      .findOne(
        { _id: member.workspace },
        {
          projection: {
            name: 1,
            description: 1,
            logoURL: 1,
            bannerURL: 1,
            createdBy: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      );

    return {
      member,
      workspace,
    };
  }

  async findByUserId(
    userId: Types.ObjectId,
    pagination?: PaginationDto,
  ): Promise<PaginateResult<WorkspaceMemberDocument>> {
    if (!pagination) {
      pagination = { page: 1, limit: 10, sortBy: '-createdAt' };
    }

    const { search, paginationOptions } = extractPaginationOptions(pagination);

    const query: FilterQuery<WorkspaceMemberDocument> = {
      user: userId,
      status: { $in: [MemberStatus.ACTIVE, MemberStatus.PENDING] },
    };

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { primaryEmail: { $regex: search, $options: 'i' } },
      ];
    }

    const restPaginationOptions = { ...paginationOptions };
    delete restPaginationOptions.populate;

    return await this.workspaceMemberModel.paginate(query, {
      ...restPaginationOptions,
      populate: {
        path: 'workspace',
        select:
          'name description logoURL bannerURL createdBy createdAt updatedAt',
      },
    });
  }

  async findByUserEmail(
    userEmail: string,
    pagination?: PaginationDto,
  ): Promise<PaginateResult<WorkspaceMemberDocument>> {
    if (!pagination) {
      pagination = { page: 1, limit: 10, sortBy: '-createdAt' };
    }

    const { search, paginationOptions } = extractPaginationOptions(pagination);

    const query: FilterQuery<WorkspaceMemberDocument> = {
      primaryEmail: userEmail,
      status: { $in: [MemberStatus.ACTIVE, MemberStatus.PENDING] },
    };

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { primaryEmail: { $regex: search, $options: 'i' } },
      ];
    }

    const restPaginationOptions = { ...paginationOptions };
    delete restPaginationOptions.populate;

    return await this.workspaceMemberModel.paginate(query, {
      ...restPaginationOptions,
      populate: {
        path: 'workspace',
        select:
          'name description logoURL bannerURL createdBy createdAt updatedAt',
      },
    });
  }

  async findByInvitedBy(
    invitedByUserId: Types.ObjectId,
    pagination?: PaginationDto,
  ): Promise<PaginateResult<WorkspaceMemberDocument>> {
    if (!pagination) {
      pagination = { page: 1, limit: 10, sortBy: '-createdAt' };
    }

    const { search, paginationOptions } = extractPaginationOptions(pagination);

    const query: FilterQuery<WorkspaceMemberDocument> = {
      invitedBy: invitedByUserId,
      status: MemberStatus.ACTIVE,
    };

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { primaryEmail: { $regex: search, $options: 'i' } },
      ];
    }

    const restPaginationOptions = { ...paginationOptions };
    delete restPaginationOptions.populate;

    return await this.workspaceMemberModel.paginate(query, {
      ...restPaginationOptions,
      populate: [
        {
          path: 'workspace',
          select:
            'name description logoURL bannerURL createdBy createdAt updatedAt',
        },
        {
          path: 'user',
          select: 'email timezone isEmailVerified',
        },
      ],
    });
  }

  async inviteMember(
    inviteMemberDto: InviteMemberDto,
    workspaceId: Types.ObjectId,
    invitingMember: WorkspaceMemberDocument,
  ): Promise<WorkspaceMemberDocument> {
    const existingMember = await this.workspaceMemberModel.findOne({
      primaryEmail: inviteMemberDto.primaryEmail,
      workspace: workspaceId,
    });

    if (existingMember) {
      throw new ConflictException(
        'A member with this email already exists in the workspace',
      );
    }

    if (
      invitingMember.permission === Permission.MANAGER ||
      invitingMember.permission === Permission.REGULAR
    ) {
      throw new BadRequestException(
        'Insufficient permissions to invite members',
      );
    }

    const workspaceMember = new this.workspaceMemberModel({
      workspace: workspaceId,
      firstName: inviteMemberDto.firstName,
      lastName: inviteMemberDto.lastName,
      middleName: inviteMemberDto.middleName || null,
      primaryEmail: inviteMemberDto.primaryEmail,
      permission: Permission.REGULAR,
      status: MemberStatus.PENDING,
      workPhone: inviteMemberDto.workPhone || null,
      primaryRole: inviteMemberDto.primaryRole
        ? new Types.ObjectId(inviteMemberDto.primaryRole)
        : null,
      primaryTeam: inviteMemberDto.primaryTeam
        ? new Types.ObjectId(inviteMemberDto.primaryTeam)
        : null,
      invitedBy: invitingMember.user,
    });

    return await workspaceMember.save();
  }

  async acceptInvitation(
    memberId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<WorkspaceMemberDocument> {
    const member = await this.workspaceMemberModel.findById(memberId).exec();

    if (!member) {
      throw new BadRequestException('Invitation not found');
    }

    if (member.status !== MemberStatus.PENDING) {
      throw new BadRequestException('Invitation is not pending');
    }

    if (member.user && member.user.toString() !== userId.toString()) {
      throw new BadRequestException('Invalid user for this invitation');
    }

    member.status = MemberStatus.ACTIVE;
    member.lastActiveAt = new Date();

    if (!member.user) {
      member.user = userId;
    }

    return await member.save();
  }
}
