import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Space } from '../schemas/space.schema';
import { CreateSpaceDto, UpdateSpaceDto } from '../dto/space.dto';
import { SpaceParticipantService } from '../space-participants/services/space-participant.service';

@Injectable()
export class SpaceService {
  constructor(
    @InjectRepository(Space)
    private spaceRepository: Repository<Space>,
    private spaceParticipantService: SpaceParticipantService,
  ) {}

  async create(
    createSpaceDto: CreateSpaceDto,
    workspaceId: string,
    createdBy: string,
  ): Promise<Space> {
    const space = this.spaceRepository.create({
      ...createSpaceDto,
      workspaceId,
      createdById: createdBy,
    });

    const savedSpace = await this.spaceRepository.save(space);

    await this.spaceParticipantService.initializeDefaultParticipant(
      savedSpace.id,
      createdBy,
      workspaceId,
    );

    return savedSpace;
  }

  async update(
    spaceId: string,
    updateSpaceDto: UpdateSpaceDto,
    workspaceId: string,
  ): Promise<Space> {
    await this.spaceRepository.update(
      { id: spaceId, workspaceId, isDeleted: false },
      updateSpaceDto,
    );

    const space = await this.spaceRepository.findOne({
      where: { id: spaceId },
    });

    if (!space) {
      throw new NotFoundException('Space not found');
    }

    return space;
  }

  async getSpaceDetails(
    spaceId: string,
    workspaceId: string,
  ): Promise<any> {
    const space = await this.spaceRepository.findOne({
      where: { id: spaceId, workspaceId, isDeleted: false },
      relations: ['lists'],
    });

    if (!space) {
      throw new NotFoundException('Space not found');
    }

    const lists = await this.spaceRepository
      .createQueryBuilder('space')
      .leftJoinAndSelect('space.lists', 'list')
      .where('space.id = :spaceId', { spaceId })
      .andWhere('list.workspaceId = :workspaceId', { workspaceId })
      .andWhere('list.isDeleted = :isDeleted', { isDeleted: false })
      .orderBy('list.createdAt', 'DESC')
      .select(['list.id', 'list.name', 'list.isPrivate', 'list.createdAt', 'list.updatedAt'])
      .getRawMany();

    return {
      space,
      lists: lists.map((list) => ({
        id: list.list_id,
        name: list.list_name,
        isPrivate: list.list_isPrivate,
        createdAt: list.list_createdAt,
        updatedAt: list.list_updatedAt,
      })),
    };
  }
}
