import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../schemas/role.schema';
import { CreateRoleDto, UpdateRoleDto } from '../dto/role.dto';
import {
  PaginationDto,
  extractPaginationOptions,
} from '../../../workspace-members/dto/pagination.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(
    createRoleDto: CreateRoleDto,
    workspaceId: string,
    createdById: string,
  ): Promise<Role> {
    const role = this.roleRepository.create({
      ...createRoleDto,
      workspaceId,
      createdById,
    });

    return await this.roleRepository.save(role);
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

    const queryBuilder = this.roleRepository.createQueryBuilder('role');
    queryBuilder.where(where);

    if (search) {
      queryBuilder.andWhere(
        '(role.name ILIKE :search OR role.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder.leftJoinAndSelect('role.createdBy', 'createdBy');

    const page = paginationOptions.page || 1;
    const limit = paginationOptions.limit || 10;

    queryBuilder.skip((page - 1) * limit).take(limit);

    if (paginationOptions.sort) {
      const sortOrder = paginationOptions.sort.startsWith('-') ? 'DESC' : 'ASC';
      const sortField = paginationOptions.sort.replace('-', '');
      queryBuilder.orderBy(`role.${sortField}`, sortOrder);
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

  async findById(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role || role.isDeleted) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  async update(
    id: string,
    updateRoleDto: UpdateRoleDto,
    workspaceId: string,
  ): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id, workspaceId, isDeleted: false },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    Object.assign(role, updateRoleDto);
    await this.roleRepository.save(role);

    return await this.roleRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });
  }

  async moveToTrash(id: string, workspaceId: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id, workspaceId, isDeleted: false },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    role.isDeleted = true;
    return await this.roleRepository.save(role);
  }

  async toggleActive(
    id: string,
    isActive: boolean,
    workspaceId: string,
  ): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id, workspaceId, isDeleted: false },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    role.isActive = isActive;
    await this.roleRepository.save(role);

    return await this.roleRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });
  }
}
