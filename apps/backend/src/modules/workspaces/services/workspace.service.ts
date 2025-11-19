import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from '../schemas/workspace.schema';
import { CreateWorkspaceDto } from '../dto/workspace.dto';
import { WorkspaceMemberService } from 'src/modules/workspace-members/services/workspace-member.service';
import { WorkspaceMember } from 'src/modules/workspace-members/schemas/workspace-member.schema';
import { WalletService } from 'src/modules/billing/wallets/services/wallet.service';
import { User } from 'src/modules/users/schemas/user.schema';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
    private workspaceMemberService: WorkspaceMemberService,
    private walletService: WalletService,
  ) {}

  async createWorkspace(
    createWorkspaceDto: CreateWorkspaceDto,
    user: User,
  ): Promise<{
    workspace: Workspace;
    member: WorkspaceMember;
  }> {
    const workspace = this.workspaceRepository.create({
      ...createWorkspaceDto,
      createdById: user.id,
    });

    const savedWorkspace = await this.workspaceRepository.save(workspace);

    const workspaceMember =
      await this.workspaceMemberService.initializeWorkspaceOwner(
        user.id,
        savedWorkspace.id,
        user.email,
        'Admin',
        savedWorkspace.name,
      );

    await this.walletService.initializeWallet(savedWorkspace.id);

    return {
      workspace: savedWorkspace,
      member: workspaceMember,
    };
  }

  async findWorkspaceById(workspaceId: string): Promise<Workspace | null> {
    try {
      return await this.workspaceRepository.findOne({
        where: { id: workspaceId },
        relations: ['createdBy'],
      });
    } catch {
      return null;
    }
  }

  async findUserWorkspaces(userId: string): Promise<Workspace[]> {
    return await this.workspaceRepository.find({
      where: { createdById: userId },
      order: { createdAt: 'DESC' },
    });
  }

  async updateWorkspace(
    workspaceId: string,
    updateData: Partial<Workspace>,
  ): Promise<Workspace | null> {
    await this.workspaceRepository.update(workspaceId, updateData);
    return await this.workspaceRepository.findOne({
      where: { id: workspaceId },
    });
  }

  async deleteWorkspace(workspaceId: string): Promise<boolean> {
    const result = await this.workspaceRepository.delete(workspaceId);
    return result.affected > 0;
  }
}
