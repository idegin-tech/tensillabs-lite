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
      // Default pagination
      pagination = { page: 1, limit: 10, sortBy: '-createdAt' };
    }

    const { search, paginationOptions } = extractPaginationOptions(pagination);

    const query: FilterQuery<WorkspaceMemberDocument> = {
      workspace: workspaceId,
      status: MemberStatus.ACTIVE,
    };

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { primaryEmail: { $regex: search, $options: 'i' } },
      ];
    }

    return await this.workspaceMemberModel.paginate(query, {
      ...paginationOptions,
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

  async findByUser(userId: Types.ObjectId): Promise<WorkspaceMemberDocument[]> {
    return await this.workspaceMemberModel
      .find({ user: userId, status: MemberStatus.ACTIVE })
      .populate('workspace', 'name description logoURL bannerURL')
      .sort({ createdAt: -1 })
      .exec();
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
      invitedBy: invitingMember.user,
    });

    return await workspaceMember.save();
  }
}
