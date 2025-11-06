import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from '../schemas/list.schema';
import { CreateListDto, ManageTagsDto } from '../dto/list.dto';
import { Task } from '../../tasks/schemas/task.schema';
import { File } from '../../../../files/schemas/file.schema';
import { GetListFilesQueryDto } from '../dto/list-files.dto';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List)
    private listRepository: Repository<List>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}

  async create(
    createListDto: CreateListDto,
    spaceId: string,
    workspaceId: string,
  ): Promise<List> {
    const list = this.listRepository.create({
      ...createListDto,
      spaceId: spaceId,
      workspaceId: workspaceId,
    });

    return await this.listRepository.save(list);
  }

  async getListsBySpace(
    spaceId: string,
    workspaceId: string,
  ): Promise<List[]> {
    return await this.listRepository.find({
      where: {
        spaceId: spaceId,
        workspaceId: workspaceId,
        isDeleted: false,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async getListDetails(
    listId: string,
    workspaceId: string,
  ): Promise<any> {
    const list = await this.listRepository.findOne({
      where: {
        id: listId,
        workspaceId: workspaceId,
        isDeleted: false,
      },
    });

    if (!list) {
      throw new NotFoundException('List not found');
    }

    const taskCount = await this.taskRepository.count({
      where: {
        listId: listId,
        workspaceId: workspaceId,
        isDeleted: false,
      },
    });

    return {
      ...list,
      taskCount,
    };
  }

  async getListFiles(
    listId: string,
    workspaceId: string,
    queryParams: GetListFilesQueryDto,
  ): Promise<{
    files: File[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const list = await this.listRepository.findOne({
      where: {
        id: listId,
        workspaceId: workspaceId,
        isDeleted: false,
      },
    });

    if (!list) {
      throw new NotFoundException('List not found');
    }

    const tasks = await this.taskRepository.find({
      where: {
        listId: listId,
        workspaceId: workspaceId,
        isDeleted: false,
      },
      select: ['id'],
    });

    const taskIds = tasks.map((task) => task.id);

    const queryBuilder = this.fileRepository
      .createQueryBuilder('file')
      .where('file.taskId IN (:...taskIds)', { taskIds })
      .andWhere('file.workspaceId = :workspaceId', { workspaceId })
      .andWhere('file.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('file.isActive = :isActive', { isActive: true });

    if (queryParams.search) {
      queryBuilder.andWhere(
        '(file.name ILIKE :search OR file.description ILIKE :search)',
        { search: `%${queryParams.search}%` },
      );
    }

    if (queryParams.mimeType) {
      queryBuilder.andWhere('file.mimeType ILIKE :mimeType', {
        mimeType: `%${queryParams.mimeType}%`,
      });
    }

    const sortFieldMap: Record<string, string> = {
      name: 'name',
      size: 'size',
      createdAt: 'createdAt',
      uploadedAt: 'createdAt',
    };

    const sortField = sortFieldMap[queryParams.sortBy || 'createdAt'] || 'createdAt';
    const sortOrder = queryParams.sortOrder === 'asc' ? 'ASC' : 'DESC';
    queryBuilder.orderBy(`file.${sortField}`, sortOrder);

    const totalCount = await queryBuilder.getCount();
    const totalPages = Math.ceil(totalCount / queryParams.limit);

    queryBuilder
      .skip((queryParams.page - 1) * queryParams.limit)
      .take(queryParams.limit);

    queryBuilder.leftJoinAndSelect('file.createdBy', 'createdBy');

    const files = await queryBuilder.getMany();

    return {
      files,
      totalCount,
      page: queryParams.page,
      limit: queryParams.limit,
      totalPages,
    };
  }

  async manageTags(
    listId: string,
    workspaceId: string,
    manageTagsDto: ManageTagsDto,
  ): Promise<List> {
    const list = await this.listRepository.findOne({
      where: {
        id: listId,
        workspaceId: workspaceId,
        isDeleted: false,
      },
    });

    if (!list) {
      throw new NotFoundException('List not found');
    }

    let tags = list.tags || [];

    if (manageTagsDto.tagsToDelete && manageTagsDto.tagsToDelete.length > 0) {
      tags = tags.filter(tag => !manageTagsDto.tagsToDelete.includes(tag.value));
    }

    if (manageTagsDto.tagsToUpdate && manageTagsDto.tagsToUpdate.length > 0) {
      for (const update of manageTagsDto.tagsToUpdate) {
        const index = tags.findIndex(tag => tag.value === update.oldValue);
        if (index !== -1) {
          tags[index] = update.newTag;
        }
      }
    }

    if (manageTagsDto.tagsToCreate && manageTagsDto.tagsToCreate.length > 0) {
      const existingValues = new Set(tags.map(tag => tag.value));
      for (const newTag of manageTagsDto.tagsToCreate) {
        if (!existingValues.has(newTag.value)) {
          tags.push(newTag);
        }
      }
    }

    list.tags = tags;
    return await this.listRepository.save(list);
  }
}
