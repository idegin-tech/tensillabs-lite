import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../schemas/project.schema';
import { CreateProjectDto, UpdateProjectDto } from '../dto/project.dto';
import { PaginationDto } from '../../workspace-members/dto/pagination.dto';
import { extractPaginationOptions } from '../../workspace-members/dto/pagination.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    workspaceId: string,
    createdById: string,
  ): Promise<Project> {
    const projectData: Record<string, any> = {
      ...createProjectDto,
      workspaceId,
      createdById,
    };

    if (createProjectDto.client) {
      projectData.clientId = createProjectDto.client;
    }

    const project = this.projectRepository.create(projectData);

    return await this.projectRepository.save(project);
  }

  async findAll(workspaceId: string, pagination: PaginationDto): Promise<any> {
    const { search, isActive, paginationOptions } =
      extractPaginationOptions(pagination);

    const where: any = {
      workspaceId,
      isDeleted: false,
    };

    if (isActive && isActive !== 'all') {
      where.isActive = isActive === 'true';
    }

    const queryBuilder = this.projectRepository.createQueryBuilder('project');
    queryBuilder.where(where);

    if (search) {
      queryBuilder.andWhere(
        '(project.name ILIKE :search OR project.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder.leftJoinAndSelect('project.createdBy', 'createdBy');
    queryBuilder.leftJoinAndSelect('project.client', 'client');

    const page = paginationOptions.page || 1;
    const limit = paginationOptions.limit || 10;

    queryBuilder.skip((page - 1) * limit).take(limit);

    if (paginationOptions.sort) {
      const sortOrder = paginationOptions.sort.startsWith('-') ? 'DESC' : 'ASC';
      const sortField = paginationOptions.sort.replace('-', '');
      queryBuilder.orderBy(`project.${sortField}`, sortOrder);
    }

    const [docs, totalDocs] = await queryBuilder.getManyAndCount();

    return {
      docs,
      totalDocs,
      limit,
      page,
      totalPages: Math.ceil(totalDocs / limit),
      hasNextPage: page < Math.ceil(totalDocs / limit),
      hasPrevPage: page > 1,
      nextPage: page < Math.ceil(totalDocs / limit) ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    };
  }

  async findById(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['client', 'createdBy'],
    });
    if (!project || project.isDeleted) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    workspaceId: string,
  ): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id, workspaceId, isDeleted: false },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (updateProjectDto.client) {
      project.clientId = updateProjectDto.client;
    } else if (
      updateProjectDto.client === null ||
      updateProjectDto.client === ''
    ) {
      project.clientId = null;
    }

    Object.assign(project, updateProjectDto);
    await this.projectRepository.save(project);

    return await this.projectRepository.findOne({
      where: { id },
      relations: ['client', 'createdBy'],
    });
  }

  async toggleActive(
    id: string,
    isActive: boolean,
    workspaceId: string,
  ): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id, workspaceId, isDeleted: false },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    project.isActive = isActive;
    await this.projectRepository.save(project);

    return await this.projectRepository.findOne({
      where: { id },
      relations: ['client', 'createdBy'],
    });
  }

  async delete(id: string, workspaceId: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id, workspaceId, isDeleted: false },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    project.isDeleted = true;
    await this.projectRepository.save(project);

    return await this.projectRepository.findOne({
      where: { id },
      relations: ['client', 'createdBy'],
    });
  }
}
