import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../schemas/team.schema';
import { CreateTeamDto, UpdateTeamDto } from '../dto/team.dto';
import {
  PaginationDto,
  extractPaginationOptions,
} from '../../../workspace-members/dto/pagination.dto';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
  ) {}

  async create(
    createTeamDto: CreateTeamDto,
    workspaceId: string,
    createdById: string,
  ): Promise<Team> {
    const team = this.teamRepository.create({
      ...createTeamDto,
      workspaceId,
      createdById,
    });

    return await this.teamRepository.save(team);
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

    const queryBuilder = this.teamRepository.createQueryBuilder('team');
    queryBuilder.where(where);

    if (search) {
      queryBuilder.andWhere(
        '(team.name ILIKE :search OR team.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder.leftJoinAndSelect('team.createdBy', 'createdBy');

    const page = paginationOptions.page || 1;
    const limit = paginationOptions.limit || 10;

    queryBuilder.skip((page - 1) * limit).take(limit);

    if (paginationOptions.sort) {
      const sortOrder = paginationOptions.sort.startsWith('-') ? 'DESC' : 'ASC';
      const sortField = paginationOptions.sort.replace('-', '');
      queryBuilder.orderBy(`team.${sortField}`, sortOrder);
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

  async findById(id: string): Promise<Team> {
    const team = await this.teamRepository.findOne({ where: { id } });
    if (!team || team.isDeleted) {
      throw new NotFoundException('Team not found');
    }
    return team;
  }

  async update(
    id: string,
    updateTeamDto: UpdateTeamDto,
    workspaceId: string,
  ): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { id, workspaceId, isDeleted: false },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    Object.assign(team, updateTeamDto);
    await this.teamRepository.save(team);

    return await this.teamRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });
  }

  async moveToTrash(id: string, workspaceId: string): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { id, workspaceId, isDeleted: false },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    team.isDeleted = true;
    return await this.teamRepository.save(team);
  }

  async toggleActive(
    id: string,
    isActive: boolean,
    workspaceId: string,
  ): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { id, workspaceId, isDeleted: false },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    team.isActive = isActive;
    await this.teamRepository.save(team);

    return await this.teamRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });
  }
}
