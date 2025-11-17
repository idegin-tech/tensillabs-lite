import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  BadRequestException,
  Headers,
  Get,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { ZodValidationPipe } from '../../../../lib/validation.pipe';
import { createSuccessResponse } from '../../../../lib/response.interface';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import {
  WorkspaceMemberGuard,
} from '../../../workspace-members/guards/workspace-member.guard';
import {
  clockInSchema,
  ClockInDto,
  clockOutSchema,
  ClockOutDto,
} from './dto/create-attendance.dto';
import { Attendance } from './schemas/attendance.schema';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validateHRMSUser } from '../hrms-user/guards/hrms-user.guard';
import { HrmsUserPermission } from '../hrms-user/hrms-user.schema';
import { HrmsSettingsService } from '../services/hrms-settings.service';

@Controller('hrms/attendance')
@UseGuards(AuthGuard, WorkspaceMemberGuard)
export class AttendanceController {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    private readonly hrmsSettingsService: HrmsSettingsService,
  ) { }

  @Post('clock-in')
  async clockIn(
    @Body(new ZodValidationPipe(clockInSchema)) dto: ClockInDto,
    @Req() req: Request & { workspaceMember?: { id: string }; workspace?: { id: string } },
    @Headers('x-user-datetime') xUserDateTime: string,
  ) {
    if (!xUserDateTime) {
      throw new BadRequestException('X-User-DateTime header is required');
    }
    const dateTime = new Date(xUserDateTime);
    if (isNaN(dateTime.getTime())) {
      throw new BadRequestException('Invalid X-User-DateTime format');
    }

    const workspaceMemberId = req.workspaceMember?.id;
    const workspaceId = req.workspace?.id;
    if (!workspaceMemberId || !workspaceId) {
      throw new BadRequestException('Workspace member and workspace ID required');
    }

    const startOfDay = new Date(dateTime);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(dateTime);
    endOfDay.setHours(23, 59, 59, 999);

    const existing = await this.attendanceRepository.findOne({
      where: {
        memberId: workspaceMemberId,
        status: 'open',
      },
    });

    if (existing) {
      throw new BadRequestException('Already clocked in');
    }

    const settings = await this.hrmsSettingsService.hrmsSettingsRepository.findOne({
      where: { workspaceId },
    });

    let isLate = false;
    if (settings) {
      const [hours, minutes] = settings.organizationOpenTime.split(':').map(Number);
      const openTime = new Date(dateTime);
      openTime.setHours(hours, minutes, 0, 0);
      isLate = dateTime > openTime;
    }

    const attendance = this.attendanceRepository.create({
      memberId: workspaceMemberId,
      workspaceId,
      officeId: dto.officeId || null,
      clockIn: dateTime,
      remarks: dto.remarks,
      status: 'open',
      isLate,
      isEarlyLeave: false,
    });

    const saved = await this.attendanceRepository.save(attendance);
    return createSuccessResponse('Clocked in successfully', saved);
  }

  @Post('clock-out')
  async clockOut(
    @Body(new ZodValidationPipe(clockOutSchema)) dto: ClockOutDto,
    @Req() req: Request & { workspaceMember?: { id: string } },
    @Headers('x-user-datetime') xUserDateTime: string,
  ) {
    if (!xUserDateTime) {
      throw new BadRequestException('X-User-DateTime header is required');
    }
    const dateTime = new Date(xUserDateTime);
    if (isNaN(dateTime.getTime())) {
      throw new BadRequestException('Invalid X-User-DateTime format');
    }

    const workspaceMemberId = req.workspaceMember?.id;
    if (!workspaceMemberId) {
      throw new BadRequestException('Workspace member ID required');
    }

    const attendance = await this.attendanceRepository.findOne({
      where: {
        memberId: workspaceMemberId,
        status: 'open',
      },
    });

    if (!attendance) {
      throw new BadRequestException('No active clock-in found');
    }

    const settings = await this.hrmsSettingsService.hrmsSettingsRepository.findOne({
      where: { workspaceId: attendance.workspaceId },
    });

    let isEarlyLeave = false;
    if (settings) {
      const [hours, minutes] = settings.organizationCloseTime.split(':').map(Number);
      const closeTime = new Date(dateTime);
      closeTime.setHours(hours, minutes, 0, 0);
      isEarlyLeave = dateTime < closeTime;
    }

    attendance.clockOut = dateTime;
    attendance.status = 'closed';
    attendance.isEarlyLeave = isEarlyLeave;
    if (dto.remarks) attendance.remarks = dto.remarks;

    const duration = dateTime.getTime() - attendance.clockIn.getTime();
    attendance.totalHours = duration / (1000 * 60 * 60);

    const saved = await this.attendanceRepository.save(attendance);
    return createSuccessResponse('Clocked out successfully', saved);
  }

  @Get()
  @UseGuards(validateHRMSUser([HrmsUserPermission.ADMIN, HrmsUserPermission.MANAGER]))
  async getWorkspaceAttendances(
    @Req() req: Request & { workspaceMember?: { id: string }, workspace?: { id: string } },
    @Query('date') date: string,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    if (!date) {
      throw new BadRequestException('date query param is required (YYYY-MM-DD)');
    }
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      throw new BadRequestException('Invalid date format, use YYYY-MM-DD');
    }
    const startOfDay = new Date(dateObj);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(dateObj);
    endOfDay.setHours(23, 59, 59, 999);
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    const workspaceMemberId = req.workspaceMember?.id;
    if (!workspaceMemberId) {
      throw new BadRequestException('Workspace member ID is required');
    }

    const queryBuilder = this.attendanceRepository
      .createQueryBuilder('attendance')
      .where('attendance.clockIn >= :startOfDay', { startOfDay })
      .andWhere('attendance.clockIn <= :endOfDay', { endOfDay });

    if (req.workspace?.id) {
      queryBuilder.leftJoinAndSelect('attendance.member', 'member')
        .andWhere('member.workspaceId = :workspaceId', { workspaceId: req.workspace.id });
    }

    queryBuilder
      .orderBy('attendance.clockIn', 'DESC')
      .skip((pageNum - 1) * limitNum)
      .take(limitNum);

    const [attendances, total] = await queryBuilder.getManyAndCount();

    return createSuccessResponse('Attendances retrieved', {
      data: attendances,
      total,
      page: pageNum,
      limit: limitNum,
      hasMore: pageNum * limitNum < total,
    });
  }

  @Get('my-attendance')
  async getMyAttendance(
    @Req() req: Request & { workspaceMember?: { id: string } },
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('status') status?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    const workspaceMemberId = req.workspaceMember?.id;
    if (!workspaceMemberId) {
      throw new BadRequestException('Workspace member ID is required');
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    const queryBuilder = this.attendanceRepository
      .createQueryBuilder('attendance')
      .where('attendance.memberId = :memberId', { memberId: workspaceMemberId });

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      queryBuilder.andWhere('attendance.clockIn >= :startDate', { startDate: start });
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      queryBuilder.andWhere('attendance.clockIn <= :endDate', { endDate: end });
    }

    if (status && status !== 'all') {
      queryBuilder.andWhere('attendance.status = :status', { status });
    }

    queryBuilder
      .orderBy('attendance.clockIn', 'DESC')
      .skip((pageNum - 1) * limitNum)
      .take(limitNum);

    const [attendances, total] = await queryBuilder.getManyAndCount();

    return createSuccessResponse('My attendance retrieved', {
      data: attendances,
      total,
      page: pageNum,
      limit: limitNum,
      hasMore: pageNum * limitNum < total,
    });
  }
}
