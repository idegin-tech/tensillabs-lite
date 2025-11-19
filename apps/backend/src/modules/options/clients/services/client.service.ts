/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Client } from '../schemas/client.schema';
import { CreateClientDto, UpdateClientDto } from '../dto/client.dto';
import {
  PaginationDto,
  extractPaginationOptions,
} from '../../../workspace-members/dto/pagination.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  async create(
    createClientDto: CreateClientDto,
    workspaceId: string,
    createdById: string,
  ): Promise<Client> {
    const client = this.clientRepository.create({
      ...createClientDto,
      workspaceId,
      createdById,
      officeIds: createClientDto.offices || [],
    });

    return await this.clientRepository.save(client);
  }

  async findAll(
    workspaceId: string,
    pagination: PaginationDto,
  ): Promise<{ data: Client[]; total: number; page: number; limit: number }> {
    const { search, isActive, paginationOptions } =
      extractPaginationOptions(pagination);

    const queryBuilder = this.clientRepository
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.createdBy', 'createdBy')
      .leftJoinAndSelect('client.workspace', 'workspace')
      .where('client.workspaceId = :workspaceId', { workspaceId })
      .andWhere('client.isDeleted = :isDeleted', { isDeleted: false });

    if (search) {
      queryBuilder.andWhere(
        '(client.name ILIKE :search OR client.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (isActive && isActive !== 'all') {
      queryBuilder.andWhere('client.isActive = :isActive', {
        isActive: isActive === 'true',
      });
    }

    const total = await queryBuilder.getCount();

    const data = await queryBuilder
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .take(paginationOptions.limit)
      .getMany();

    return {
      data,
      total,
      page: paginationOptions.page,
      limit: paginationOptions.limit,
    };
  }

  async findById(id: string): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['offices'],
    });
    
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    return client;
  }

  async update(
    id: string,
    updateClientDto: UpdateClientDto,
    workspaceId: string,
  ): Promise<Client> {
    const updateData: Partial<Client> = { ...updateClientDto };

    if (updateClientDto.offices) {
      updateData.officeIds = updateClientDto.offices;
    }

    await this.clientRepository.update(
      { id, workspaceId, isDeleted: false },
      updateData,
    );

    const client = await this.clientRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  async moveToTrash(id: string, workspaceId: string): Promise<Client> {
    await this.clientRepository.update(
      { id, workspaceId, isDeleted: false },
      { isDeleted: true },
    );

    const client = await this.clientRepository.findOne({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  async toggleActive(
    id: string,
    isActive: boolean,
    workspaceId: string,
  ): Promise<Client> {
    await this.clientRepository.update(
      { id, workspaceId, isDeleted: false },
      { isActive },
    );

    const client = await this.clientRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!client || client.isDeleted) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }
}
