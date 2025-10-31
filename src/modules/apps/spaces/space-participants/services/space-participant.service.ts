/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  SpaceParticipant,
  SpacePermission,
  ParticipantStatus,
} from '../schemas/space-participant.schema';
import {
  InviteParticipantDto,
  UpdateParticipantDto,
} from '../dto/space-participant.dto';
import { Space } from '../../schemas/space.schema';
import {
  PaginationDto,
  extractPaginationOptions,
} from '../../../../workspace-members/dto/pagination.dto';

@Injectable()
export class SpaceParticipantService {
  constructor(
    @InjectRepository(SpaceParticipant)
    private spaceParticipantRepository: Repository<SpaceParticipant>,
    @InjectRepository(Space)
    private spaceRepository: Repository<Space>,
  ) {}

  async initializeDefaultParticipant(
    spaceId: string,
    memberId: string,
    workspaceId: string,
  ): Promise<SpaceParticipant> {
    const participant = this.spaceParticipantRepository.create({
      spaceId,
      memberId,
      workspaceId,
      permissions: SpacePermission.ADMIN,
      status: ParticipantStatus.ACTIVE,
    });

    return await this.spaceParticipantRepository.save(participant);
  }

  async inviteParticipant(
    spaceId: string,
    inviteParticipantDto: InviteParticipantDto,
    workspaceId: string,
  ): Promise<SpaceParticipant> {
    const existingParticipant = await this.spaceParticipantRepository.findOne({
      where: {
        spaceId,
        memberId: inviteParticipantDto.memberId,
        workspaceId,
      },
    });

    if (existingParticipant) {
      throw new ForbiddenException('Member is already a participant');
    }

    const participant = this.spaceParticipantRepository.create({
      spaceId,
      memberId: inviteParticipantDto.memberId,
      workspaceId,
      permissions: inviteParticipantDto.permissions || SpacePermission.REGULAR,
      status: ParticipantStatus.ACTIVE,
    });

    return await this.spaceParticipantRepository.save(participant);
  }

  async updateParticipant(
    participantId: string,
    updateParticipantDto: UpdateParticipantDto,
    workspaceId: string,
  ): Promise<SpaceParticipant> {
    const participant = await this.spaceParticipantRepository.findOne({
      where: {
        id: participantId,
        workspaceId,
        status: ParticipantStatus.ACTIVE,
      },
      relations: ['space'],
    });

    if (!participant) {
      throw new NotFoundException('Participant not found');
    }

    const space = participant.space;
    if (space.createdById === participant.memberId) {
      throw new ForbiddenException(
        'Cannot update space owner permissions or status',
      );
    }

    await this.spaceParticipantRepository.update(
      { id: participantId, workspaceId },
      updateParticipantDto,
    );

    return await this.spaceParticipantRepository.findOne({
      where: { id: participantId },
    });
  }

  async getSpaceParticipants(
    spaceId: string,
    workspaceId: string,
    pagination?: PaginationDto,
  ): Promise<any> {
    if (!pagination) {
      pagination = { page: 1, limit: 10, sortBy: '-createdAt' };
    }

    const { search, paginationOptions } = extractPaginationOptions(pagination);

    const queryBuilder = this.spaceParticipantRepository
      .createQueryBuilder('participant')
      .leftJoinAndSelect('participant.member', 'member')
      .where('participant.spaceId = :spaceId', { spaceId })
      .andWhere('participant.workspaceId = :workspaceId', { workspaceId })
      .andWhere('participant.status = :status', { status: ParticipantStatus.ACTIVE });

    if (search) {
      queryBuilder.andWhere(
        '(member.firstName ILIKE :search OR member.lastName ILIKE :search OR member.primaryEmail ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const page = paginationOptions.page || 1;
    const limit = paginationOptions.limit || 10;

    queryBuilder.skip((page - 1) * limit).take(limit);

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

  async getSpacesByParticipant(
    memberId: string,
    workspaceId: string,
    pagination?: PaginationDto,
  ): Promise<any> {
    if (!pagination) {
      pagination = { page: 1, limit: 30, sortBy: '-createdAt' };
    }

    const { search, paginationOptions } = extractPaginationOptions(pagination);

    const queryBuilder = this.spaceParticipantRepository
      .createQueryBuilder('participant')
      .leftJoinAndSelect('participant.space', 'space')
      .where('participant.memberId = :memberId', { memberId })
      .andWhere('participant.workspaceId = :workspaceId', { workspaceId })
      .andWhere('participant.status = :status', { status: ParticipantStatus.ACTIVE })
      .andWhere('space.isDeleted = :isDeleted', { isDeleted: false });

    if (search) {
      queryBuilder.andWhere('space.name ILIKE :search', { search: `%${search}%` });
    }

    const page = paginationOptions.page || 1;
    const limit = paginationOptions.limit || 30;

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [docs, totalDocs] = await queryBuilder.getManyAndCount();

    const enhancedDocs = await Promise.all(
      docs.map(async (doc) => {
        if (!doc.space) return doc;

        const spaceId = doc.space.id;

        const [participantCount, recentParticipants, listCount] =
          await Promise.all([
            this.spaceParticipantRepository.count({
              where: {
                spaceId,
                workspaceId,
                status: ParticipantStatus.ACTIVE,
              },
            }),
            this.spaceParticipantRepository.find({
              where: {
                spaceId,
                workspaceId,
                status: ParticipantStatus.ACTIVE,
              },
              relations: ['member'],
              order: { createdAt: 'DESC' },
              take: 5,
            }),
            this.spaceRepository
              .createQueryBuilder('space')
              .leftJoin('space.lists', 'list')
              .where('space.id = :spaceId', { spaceId })
              .andWhere('list.workspaceId = :workspaceId', { workspaceId })
              .andWhere('list.isDeleted = :isDeleted', { isDeleted: false })
              .getCount(),
          ]);

        return {
          ...doc,
          space: {
            ...doc.space,
            participantCount,
            recentParticipants: recentParticipants.map((p) => ({
              id: p.member.id,
              firstName: p.member.firstName,
              lastName: p.member.lastName,
              primaryEmail: p.member.primaryEmail,
            })),
            listCount,
          },
        };
      }),
    );

    return {
      docs: enhancedDocs,
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
}
