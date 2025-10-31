import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from '../schemas/list.schema';
import { CreateListDto } from '../dto/list.dto';
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

    const sortField = queryParams.sortBy || 'createdAt';
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
}

