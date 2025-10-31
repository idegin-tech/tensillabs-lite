import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Office } from '../schemas/office.schema';
import { CreateOfficeDto, UpdateOfficeDto } from '../dto/office.dto';
import {
  PaginationDto,
  extractPaginationOptions,
} from '../../../workspace-members/dto/pagination.dto';

@Injectable()
export class OfficeService {
  constructor(
    @InjectRepository(Office)
    private officeRepository: Repository<Office>,
  ) {}

  async create(
    createOfficeDto: CreateOfficeDto,
    workspaceId: string,
    createdById: string,
  ): Promise<Office> {
    const office = this.officeRepository.create({
      ...createOfficeDto,
      workspaceId,
      createdById,
    });

    return await this.officeRepository.save(office);
  }

  async findAll(
    workspaceId: string,
    pagination: PaginationDto,
  ): Promise<any> {
    const { search, paginationOptions } = extractPaginationOptions(pagination);

    const where: any = {
      workspaceId,
      isDeleted: false,
    };

    if (pagination.isActive && pagination.isActive !== 'all') {
      where.isActive = pagination.isActive === 'true';
    }

    const queryBuilder = this.officeRepository.createQueryBuilder('office');
    queryBuilder.where(where);

    if (search) {
      queryBuilder.andWhere(
        '(office.name ILIKE :search OR office.description ILIKE :search OR office.address ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder.leftJoinAndSelect('office.createdBy', 'createdBy');

    const page = paginationOptions.page || 1;
    const limit = paginationOptions.limit || 10;

    queryBuilder.skip((page - 1) * limit).take(limit);

    if (paginationOptions.sort) {
      const sortOrder = paginationOptions.sort.startsWith('-') ? 'DESC' : 'ASC';
      const sortField = paginationOptions.sort.replace('-', '');
      queryBuilder.orderBy(`office.${sortField}`, sortOrder);
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

  async findById(id: string): Promise<Office> {
    const office = await this.officeRepository.findOne({ where: { id } });
    if (!office || office.isDeleted) {
      throw new NotFoundException('Office not found');
    }
    return office;
  }

  async update(
    id: string,
    updateOfficeDto: UpdateOfficeDto,
    workspaceId: string,
  ): Promise<Office> {
    const office = await this.officeRepository.findOne({
      where: { id, workspaceId, isDeleted: false },
    });

    if (!office) {
      throw new NotFoundException('Office not found');
    }

    Object.assign(office, updateOfficeDto);
    await this.officeRepository.save(office);

    return await this.officeRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });
  }

  async moveToTrash(id: string, workspaceId: string): Promise<Office> {
    const office = await this.officeRepository.findOne({
      where: { id, workspaceId, isDeleted: false },
    });

    if (!office) {
      throw new NotFoundException('Office not found');
    }

    office.isDeleted = true;
    return await this.officeRepository.save(office);
  }

  async toggleActive(
    id: string,
    isActive: boolean,
    workspaceId: string,
  ): Promise<Office> {
    const office = await this.officeRepository.findOne({
      where: { id, workspaceId, isDeleted: false },
    });

    if (!office) {
      throw new NotFoundException('Office not found');
    }

    office.isActive = isActive;
    await this.officeRepository.save(office);

    return await this.officeRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });
  }
}
