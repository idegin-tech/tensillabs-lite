import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeOffRequest, TimeOffStatus } from '../schemas/time-off-request.schema';
import { Employee } from '../../employees/employee.schema';
import {
  CreateTimeOffRequestDto,
  UpdateTimeOffRequestDto,
} from '../dto/time-off-request.dto';

@Injectable()
export class TimeOffRequestService {
  constructor(
    @InjectRepository(TimeOffRequest)
    private readonly timeOffRequestRepository: Repository<TimeOffRequest>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(
    createTimeOffRequestDto: CreateTimeOffRequestDto,
    memberId: string,
    workspaceId: string,
  ): Promise<TimeOffRequest> {
    const employee = await this.employeeRepository.findOne({
      where: {
        memberId,
        workspaceId,
      },
    });

    if (!employee) {
      throw new NotFoundException('Employee record not found');
    }

    const existingPendingRequest = await this.timeOffRequestRepository.findOne({
      where: {
        employeeId: employee.id,
        workspaceId,
        status: TimeOffStatus.PENDING,
      },
    });

    if (existingPendingRequest) {
      throw new ForbiddenException(
        'You already have a pending time off request. Please wait for it to be processed before submitting another request.',
      );
    }

    const timeOffRequest = this.timeOffRequestRepository.create({
      ...createTimeOffRequestDto,
      startDate: new Date(createTimeOffRequestDto.startDate),
      endDate: new Date(createTimeOffRequestDto.endDate),
      employeeId: employee.id,
      memberId,
      workspaceId,
      status: TimeOffStatus.PENDING,
    });

    return await this.timeOffRequestRepository.save(timeOffRequest);
  }

  async findAll(
    workspaceId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: TimeOffRequest[]; total: number }> {
    const queryBuilder = this.timeOffRequestRepository
      .createQueryBuilder('timeOffRequest')
      .leftJoinAndSelect('timeOffRequest.member', 'member')
      .leftJoinAndSelect('timeOffRequest.employee', 'employee')
      .leftJoinAndSelect('timeOffRequest.coverBy', 'coverBy')
      .leftJoinAndSelect('timeOffRequest.approvedBy', 'approvedBy')
      .leftJoinAndSelect('timeOffRequest.rejectedBy', 'rejectedBy')
      .where('timeOffRequest.workspaceId = :workspaceId', { workspaceId })
      .orderBy('timeOffRequest.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  async findByMember(
    memberId: string,
    workspaceId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: TimeOffRequest[]; total: number }> {
    const queryBuilder = this.timeOffRequestRepository
      .createQueryBuilder('timeOffRequest')
      .leftJoinAndSelect('timeOffRequest.member', 'member')
      .leftJoinAndSelect('timeOffRequest.employee', 'employee')
      .leftJoinAndSelect('timeOffRequest.coverBy', 'coverBy')
      .leftJoinAndSelect('timeOffRequest.approvedBy', 'approvedBy')
      .leftJoinAndSelect('timeOffRequest.rejectedBy', 'rejectedBy')
      .where('timeOffRequest.workspaceId = :workspaceId', { workspaceId })
      .andWhere('timeOffRequest.memberId = :memberId', { memberId })
      .orderBy('timeOffRequest.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  async findOne(id: string, workspaceId: string): Promise<TimeOffRequest> {
    const timeOffRequest = await this.timeOffRequestRepository.findOne({
      where: { id, workspaceId },
      relations: ['member', 'employee', 'coverBy', 'approvedBy', 'rejectedBy'],
    });

    if (!timeOffRequest) {
      throw new NotFoundException('Time off request not found');
    }

    return timeOffRequest;
  }

  async update(
    id: string,
    updateTimeOffRequestDto: UpdateTimeOffRequestDto,
    workspaceId: string,
  ): Promise<TimeOffRequest> {
    const timeOffRequest = await this.findOne(id, workspaceId);

    if (timeOffRequest.status !== TimeOffStatus.PENDING) {
      throw new ForbiddenException(
        'Cannot update a time off request that is not pending',
      );
    }

    if (updateTimeOffRequestDto.startDate) {
      timeOffRequest.startDate = new Date(updateTimeOffRequestDto.startDate);
    }

    if (updateTimeOffRequestDto.endDate) {
      timeOffRequest.endDate = new Date(updateTimeOffRequestDto.endDate);
    }

    if (updateTimeOffRequestDto.type) {
      timeOffRequest.type = updateTimeOffRequestDto.type;
    }

    if (updateTimeOffRequestDto.reason !== undefined) {
      timeOffRequest.reason = updateTimeOffRequestDto.reason;
    }

    if (updateTimeOffRequestDto.coverById !== undefined) {
      timeOffRequest.coverById = updateTimeOffRequestDto.coverById;
    }

    return await this.timeOffRequestRepository.save(timeOffRequest);
  }

  async approve(
    id: string,
    approvedById: string,
    workspaceId: string,
  ): Promise<TimeOffRequest> {
    const timeOffRequest = await this.findOne(id, workspaceId);

    if (timeOffRequest.status !== TimeOffStatus.PENDING) {
      throw new ForbiddenException('Time off request is not pending');
    }

    timeOffRequest.status = TimeOffStatus.APPROVED;
    timeOffRequest.approvedById = approvedById;
    timeOffRequest.approvedAt = new Date();

    return await this.timeOffRequestRepository.save(timeOffRequest);
  }

  async reject(
    id: string,
    rejectedById: string,
    workspaceId: string,
  ): Promise<TimeOffRequest> {
    const timeOffRequest = await this.findOne(id, workspaceId);

    if (timeOffRequest.status !== TimeOffStatus.PENDING) {
      throw new ForbiddenException('Time off request is not pending');
    }

    timeOffRequest.status = TimeOffStatus.REJECTED;
    timeOffRequest.rejectedById = rejectedById;
    timeOffRequest.rejectedAt = new Date();

    return await this.timeOffRequestRepository.save(timeOffRequest);
  }

  async delete(id: string, workspaceId: string): Promise<void> {
    const timeOffRequest = await this.findOne(id, workspaceId);

    if (timeOffRequest.status !== TimeOffStatus.PENDING) {
      throw new ForbiddenException(
        'Cannot delete a time off request that is not pending',
      );
    }

    await this.timeOffRequestRepository.remove(timeOffRequest);
  }
}
