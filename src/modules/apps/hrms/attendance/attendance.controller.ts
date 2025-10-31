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
  toggleAttendanceSchema,
  ToggleAttendanceDto,
} from './dto/create-attendance.dto';
import { Attendance } from './schemas/attendance.schema';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validateHRMSUser } from '../hrms-user/guards/hrms-user.guard';
import { HrmsUserPermission } from '../hrms-user/hrms-user.schema';

@Controller('hrms/attendance')
@UseGuards(AuthGuard, WorkspaceMemberGuard)
export class AttendanceController {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
  ) {}

  @Post()
  async toggleAttendance(
    @Body(new ZodValidationPipe(toggleAttendanceSchema))
    toggleAttendanceDto: ToggleAttendanceDto,
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
      throw new BadRequestException('Workspace member ID is required');
    }
    const startOfDay = new Date(dateTime);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(dateTime);
    endOfDay.setHours(23, 59, 59, 999);

    const queryBuilder = this.attendanceRepository
      .createQueryBuilder('attendance')
      .where('attendance.memberId = :memberId', { memberId: workspaceMemberId })
      .andWhere('attendance.status = :status', { status: 'open' })
      .andWhere('attendance.clockIn >= :startOfDay', { startOfDay })
      .andWhere('attendance.clockIn <= :endOfDay', { endOfDay });

    if (toggleAttendanceDto.office) {
      queryBuilder.andWhere('attendance.officeId = :officeId', { officeId: toggleAttendanceDto.office });
    }

    let attendance = await queryBuilder.getOne();

    if (!attendance) {
      const newAttendance = this.attendanceRepository.create({
        memberId: workspaceMemberId,
        officeId: toggleAttendanceDto.office || null,
        clockIn: dateTime,
        remarks: toggleAttendanceDto.remarks,
        status: 'open',
      });
      attendance = await this.attendanceRepository.save(newAttendance);
      return createSuccessResponse('Clocked in', attendance);
    } else if (!attendance.clockOut) {
      attendance.clockOut = dateTime;
      attendance.status = 'closed';
      if (toggleAttendanceDto.remarks) attendance.remarks = toggleAttendanceDto.remarks;
      await this.attendanceRepository.save(attendance);
      return createSuccessResponse('Clocked out', attendance);
    } else {
      return createSuccessResponse('Already clocked out for today', attendance);
    }
  }

  @Get()
  @UseGuards(validateHRMSUser([HrmsUserPermission.ADMIN, HrmsUserPermission.MANAGER]))
  async getAttendances(
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
}
