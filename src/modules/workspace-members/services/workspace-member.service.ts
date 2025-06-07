import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  WorkspaceMember,
  WorkspaceMemberDocument,
  Permission,
  MemberStatus,
} from '../schemas/workspace-member.schema';
import { InviteMemberDto } from '../dto/workspace-member.dto';

@Injectable()
export class WorkspaceMemberService {
  constructor(
    @InjectModel(WorkspaceMember.name)
    private workspaceMemberModel: Model<WorkspaceMemberDocument>,
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
  ): Promise<WorkspaceMemberDocument[]> {
    return await this.workspaceMemberModel
      .find({ workspace: workspaceId, status: MemberStatus.ACTIVE })
      .populate('user', 'email timezone isEmailVerified')
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateMember(
    memberId: Types.ObjectId,
    updateData: Partial<WorkspaceMember>,
  ): Promise<WorkspaceMemberDocument | null> {
    return await this.workspaceMemberModel
      .findByIdAndUpdate(memberId, updateData, { new: true })
      .exec();
  }

  async removeMember(
    userId: Types.ObjectId,
    workspaceId: Types.ObjectId,
  ): Promise<boolean> {
    const result = await this.workspaceMemberModel
      .updateOne(
        { user: userId, workspace: workspaceId },
        { status: MemberStatus.SUSPENDED },
      )
      .exec();

    return result.modifiedCount > 0;
  }

  async checkPermission(
    userId: Types.ObjectId,
    workspaceId: Types.ObjectId,
    requiredPermissions: Permission[],
  ): Promise<boolean> {
    const member = await this.findByUserAndWorkspace(userId, workspaceId);

    if (!member || member.status !== MemberStatus.ACTIVE) {
      return false;
    }

    return requiredPermissions.includes(member.permission);
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
