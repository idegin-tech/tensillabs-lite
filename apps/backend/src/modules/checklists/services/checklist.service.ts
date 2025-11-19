import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Checklist } from '../schemas/checklist.schema';
import {
  CreateChecklistDto,
  UpdateChecklistDto,
  GetChecklistsQueryDto,
} from '../dto/checklist.dto';

export interface PaginatedChecklists {
  checklists: Checklist[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable()
export class ChecklistService {
  constructor(
    @InjectRepository(Checklist)
    private checklistRepository: Repository<Checklist>,
  ) {}

  async createChecklist(
    createChecklistDto: CreateChecklistDto,
    workspaceId: string,
    currentMemberId: string,
  ): Promise<Checklist> {
    const newChecklist = this.checklistRepository.create({
      name: createChecklistDto.name,
      index: createChecklistDto.index || 0,
      taskId: createChecklistDto.task || null,
      spaceId: createChecklistDto.space || null,
      listId: createChecklistDto.list || null,
      workspaceId,
      createdById: currentMemberId,
      isDone: false,
      isDeleted: false,
    });

    return await this.checklistRepository.save(newChecklist);
  }

  async getAllChecklists(
    queryParams: GetChecklistsQueryDto,
    workspaceId: string,
  ): Promise<PaginatedChecklists> {
    const queryBuilder = this.checklistRepository
      .createQueryBuilder('checklist')
      .where('checklist.workspaceId = :workspaceId', { workspaceId })
      .andWhere('checklist.isDeleted = :isDeleted', { isDeleted: false });

    if (queryParams.task) {
      queryBuilder.andWhere('checklist.taskId = :taskId', {
        taskId: queryParams.task,
      });
    }
    if (queryParams.space) {
      queryBuilder.andWhere('checklist.spaceId = :spaceId', {
        spaceId: queryParams.space,
      });
    }
    if (queryParams.list) {
      queryBuilder.andWhere('checklist.listId = :listId', {
        listId: queryParams.list,
      });
    }
    if (queryParams.isDone !== undefined) {
      queryBuilder.andWhere('checklist.isDone = :isDone', {
        isDone: queryParams.isDone,
      });
    }

    queryBuilder.orderBy(
      `checklist.${queryParams.sortBy}`,
      queryParams.sortOrder === 'asc' ? 'ASC' : 'DESC',
    );

    const total = await queryBuilder.getCount();

    const checklists = await queryBuilder
      .leftJoinAndSelect('checklist.task', 'task')
      .leftJoinAndSelect('checklist.space', 'space')
      .leftJoinAndSelect('checklist.list', 'list')
      .leftJoinAndSelect('checklist.createdBy', 'createdBy')
      .skip((queryParams.page - 1) * queryParams.limit)
      .take(queryParams.limit)
      .getMany();

    return {
      checklists,
      pagination: {
        total,
        page: queryParams.page,
        limit: queryParams.limit,
        totalPages: Math.ceil(total / queryParams.limit),
      },
    };
  }

  async updateChecklist(
    checklistId: string,
    updateChecklistDto: UpdateChecklistDto,
    workspaceId: string,
  ): Promise<Checklist> {
    const checklist = await this.checklistRepository.findOne({
      where: {
        id: checklistId,
        workspaceId,
        isDeleted: false,
      },
    });

    if (!checklist) {
      throw new NotFoundException('Checklist not found');
    }

    const updateData: Partial<Checklist> = {};
    if (updateChecklistDto.name !== undefined) {
      updateData.name = updateChecklistDto.name;
    }
    if (updateChecklistDto.index !== undefined) {
      updateData.index = updateChecklistDto.index;
    }
    if (updateChecklistDto.isDone !== undefined) {
      updateData.isDone = updateChecklistDto.isDone;
      
      if (updateChecklistDto.isDone === true) {
        updateData.completedAt = new Date();
      } else {
        updateData.completedAt = null;
      }
    }

    await this.checklistRepository.update(checklistId, updateData);

    const updatedChecklist = await this.checklistRepository.findOne({
      where: { id: checklistId },
      relations: ['task', 'space', 'list', 'createdBy'],
    });

    return updatedChecklist;
  }

  async deleteChecklist(
    checklistId: string,
    workspaceId: string,
  ): Promise<Checklist> {
    const checklist = await this.checklistRepository.findOne({
      where: {
        id: checklistId,
        workspaceId,
        isDeleted: false,
      },
    });

    if (!checklist) {
      throw new NotFoundException('Checklist not found');
    }

    await this.checklistRepository.update(checklistId, { isDeleted: true });

    const deletedChecklist = await this.checklistRepository.findOne({
      where: { id: checklistId },
    });

    return deletedChecklist;
  }

  async getChecklistsByTask(
    taskId: string,
    workspaceId: string,
  ): Promise<Checklist[]> {
    return this.checklistRepository.find({
      where: {
        taskId,
        workspaceId,
        isDeleted: false,
      },
      order: {
        index: 'ASC',
        createdAt: 'ASC',
      },
      relations: ['createdBy'],
    });
  }
}
