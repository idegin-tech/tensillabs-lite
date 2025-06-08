import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Workspace, WorkspaceDocument } from '../schemas/workspace.schema';
import { CreateWorkspaceDto } from '../dto/workspace.dto';
import { WorkspaceMemberService } from 'src/modules/workspace-members/services/workspace-member.service';
import { UserDocument } from 'src/modules/users/schemas/user.schema';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectModel(Workspace.name)
    private workspaceModel: Model<WorkspaceDocument>,
    private workspaceMemberService: WorkspaceMemberService,
  ) {}

  async createWorkspace(
    createWorkspaceDto: CreateWorkspaceDto,
    user: UserDocument,
  ): Promise<{ workspace: WorkspaceDocument; member: any }> {
    const existingWorkspace = await this.workspaceModel.findOne({
      name: createWorkspaceDto.name,
      createdBy: user._id,
    });

    if (existingWorkspace) {
      throw new BadRequestException(
        'A workspace with this name already exists',
      );
    }

    const workspace = new this.workspaceModel({
      ...createWorkspaceDto,
      createdBy: user._id,
    });

    const savedWorkspace = await workspace.save();

    // Extract first and last name from email for workspace member
    const emailLocalPart = user.email.split('@')[0];
    const nameParts = emailLocalPart.split(/[._-]/);
    const firstName = nameParts[0] || 'User';
    const lastName = nameParts[1] || emailLocalPart;

    const workspaceMember =
      await this.workspaceMemberService.initializeWorkspaceOwner(
        user._id as Types.ObjectId,
        savedWorkspace._id as Types.ObjectId,
        user.email,
        firstName,
        lastName,
      );

    return {
      workspace: savedWorkspace,
      member: workspaceMember,
    };
  }

  async findWorkspaceById(
    workspaceId: string,
  ): Promise<WorkspaceDocument | null> {
    try {
      return await this.workspaceModel
        .findById(workspaceId)
        .populate('createdBy', 'email timezone isEmailVerified')
        .exec();
    } catch {
      return null;
    }
  }

  async findUserWorkspaces(
    userId: Types.ObjectId,
  ): Promise<WorkspaceDocument[]> {
    return await this.workspaceModel
      .find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateWorkspace(
    workspaceId: Types.ObjectId,
    updateData: Partial<Workspace>,
  ): Promise<WorkspaceDocument | null> {
    return await this.workspaceModel
      .findByIdAndUpdate(workspaceId, updateData, { new: true })
      .exec();
  }

  async deleteWorkspace(workspaceId: Types.ObjectId): Promise<boolean> {
    const result = await this.workspaceModel
      .deleteOne({ _id: workspaceId })
      .exec();

    return result.deletedCount > 0;
  }
}
