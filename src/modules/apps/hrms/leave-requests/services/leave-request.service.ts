import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveRequest, LeaveStatus } from '../schemas/leave-request.schema';
import {
  CreateLeaveRequestDto,
  UpdateLeaveRequestDto,
} from '../dto/leave-request.dto';

@Injectable()
export class LeaveRequestService {
  constructor(
    @InjectRepository(LeaveRequest)
    private readonly leaveRequestRepository: Repository<LeaveRequest>,
  ) {}

  async create(
    createLeaveRequestDto: CreateLeaveRequestDto,
    memberId: string,
    workspaceId: string,
  ): Promise<LeaveRequest> {
    const existingPendingRequest = await this.leaveRequestRepository.findOne({
      where: {
        memberId,
        workspaceId,
        status: LeaveStatus.PENDING,
      },
    });

    if (existingPendingRequest) {
      throw new ForbiddenException(
        'You already have a pending leave request. Please wait for it to be processed before submitting another request.',
      );
    }

    const leaveRequest = this.leaveRequestRepository.create({
      ...createLeaveRequestDto,
      startDate: new Date(createLeaveRequestDto.startDate),
      endDate: new Date(createLeaveRequestDto.endDate),
      memberId,
      workspaceId,
      status: LeaveStatus.PENDING,
    });

    return await this.leaveRequestRepository.save(leaveRequest);
  }

  async findOne(id: string, workspaceId: string): Promise<LeaveRequest> {
    const leaveRequest = await this.leaveRequestRepository.findOne({
      where: { id, workspaceId },
      relations: ['member', 'acceptedBy', 'rejectedBy'],
    });

    if (!leaveRequest) {
      throw new NotFoundException('Leave request not found');
    }

    return leaveRequest;
  }

  async findAll(
    workspaceId: string,
    page: number = 1,
    limit: number = 20,
    status?: LeaveStatus,
  ): Promise<{
    leaveRequests: LeaveRequest[];
    total: number;
    page: number;
    limit: number;
  }> {
    const queryBuilder = this.leaveRequestRepository
      .createQueryBuilder('leaveRequest')
      .leftJoinAndSelect('leaveRequest.member', 'member')
      .leftJoinAndSelect('leaveRequest.acceptedBy', 'acceptedBy')
      .leftJoinAndSelect('leaveRequest.rejectedBy', 'rejectedBy')
      .where('leaveRequest.workspaceId = :workspaceId', { workspaceId })
      .orderBy('leaveRequest.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (status) {
      queryBuilder.andWhere('leaveRequest.status = :status', { status });
    }

    const [leaveRequests, total] = await queryBuilder.getManyAndCount();

    return {
      leaveRequests,
      total,
      page,
      limit,
    };
  }

  async findByMember(
    memberId: string,
    workspaceId: string,
    page: number = 1,
    limit: number = 20,
    status?: LeaveStatus,
  ): Promise<{
    leaveRequests: LeaveRequest[];
    total: number;
    page: number;
    limit: number;
  }> {
    const queryBuilder = this.leaveRequestRepository
      .createQueryBuilder('leaveRequest')
      .leftJoinAndSelect('leaveRequest.member', 'member')
      .leftJoinAndSelect('leaveRequest.acceptedBy', 'acceptedBy')
      .leftJoinAndSelect('leaveRequest.rejectedBy', 'rejectedBy')
      .where('leaveRequest.workspaceId = :workspaceId', { workspaceId })
      .andWhere('leaveRequest.memberId = :memberId', { memberId })
      .orderBy('leaveRequest.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (status) {
      queryBuilder.andWhere('leaveRequest.status = :status', { status });
    }

    const [leaveRequests, total] = await queryBuilder.getManyAndCount();

    return {
      leaveRequests,
      total,
      page,
      limit,
    };
  }

  async update(
    id: string,
    updateLeaveRequestDto: UpdateLeaveRequestDto,
    memberId: string,
    workspaceId: string,
  ): Promise<LeaveRequest> {
    const leaveRequest = await this.findOne(id, workspaceId);

    if (leaveRequest.memberId !== memberId) {
      throw new ForbiddenException(
        'You can only update your own leave requests',
      );
    }

    if (leaveRequest.status !== LeaveStatus.PENDING) {
      throw new ForbiddenException(
        'You can only update pending leave requests',
      );
    }

    if (updateLeaveRequestDto.startDate) {
      leaveRequest.startDate = new Date(updateLeaveRequestDto.startDate);
    }
    if (updateLeaveRequestDto.endDate) {
      leaveRequest.endDate = new Date(updateLeaveRequestDto.endDate);
    }
    if (updateLeaveRequestDto.type) {
      leaveRequest.type = updateLeaveRequestDto.type;
    }
    if (updateLeaveRequestDto.reason !== undefined) {
      leaveRequest.reason = updateLeaveRequestDto.reason;
    }

    return await this.leaveRequestRepository.save(leaveRequest);
  }

  async delete(
    id: string,
    memberId: string,
    workspaceId: string,
  ): Promise<void> {
    const leaveRequest = await this.findOne(id, workspaceId);

    if (leaveRequest.memberId !== memberId) {
      throw new ForbiddenException(
        'You can only delete your own leave requests',
      );
    }

    if (leaveRequest.status !== LeaveStatus.PENDING) {
      throw new ForbiddenException(
        'You can only delete pending leave requests',
      );
    }

    await this.leaveRequestRepository.remove(leaveRequest);
  }

  async approve(
    id: string,
    acceptedById: string,
    workspaceId: string,
  ): Promise<LeaveRequest> {
    const leaveRequest = await this.findOne(id, workspaceId);

    if (leaveRequest.status !== LeaveStatus.PENDING) {
      throw new ForbiddenException('Leave request is not pending');
    }

    leaveRequest.status = LeaveStatus.APPROVED;
    leaveRequest.acceptedById = acceptedById;
    leaveRequest.acceptedAt = new Date();

    return await this.leaveRequestRepository.save(leaveRequest);
  }

  async reject(
    id: string,
    rejectedById: string,
    workspaceId: string,
  ): Promise<LeaveRequest> {
    const leaveRequest = await this.findOne(id, workspaceId);

    if (leaveRequest.status !== LeaveStatus.PENDING) {
      throw new ForbiddenException('Leave request is not pending');
    }

    leaveRequest.status = LeaveStatus.REJECTED;
    leaveRequest.rejectedById = rejectedById;
    leaveRequest.rejectedAt = new Date();

    return await this.leaveRequestRepository.save(leaveRequest);
  }
}
