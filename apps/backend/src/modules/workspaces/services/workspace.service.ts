import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from '../schemas/workspace.schema';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
  ) {}

  // Workspace creation removed - workspaces are now created only via APP_KEY seeding

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
