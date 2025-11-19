import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { WorkspaceMemberGuard } from '../../workspace-members/guards/workspace-member.guard';
import { createSuccessResponse } from '../../../lib/response.interface';
import { HrmsUser } from './hrms-user/hrms-user.schema';
import { Employee } from './employees/employee.schema';
import { LeaveRequest, LeaveStatus } from './leave-requests/schemas/leave-request.schema';
import { Attendance } from './attendance/schemas/attendance.schema';
import { HrmsSettings } from './schemas/hrms-settings.schema';

@Controller('hrms')
@UseGuards(AuthGuard, WorkspaceMemberGuard)
export class HrmsController {
  constructor(
    @InjectRepository(HrmsUser)
    private readonly hrmsUserRepository: Repository<HrmsUser>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(LeaveRequest)
    private readonly leaveRequestRepository: Repository<LeaveRequest>,
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    @InjectRepository(HrmsSettings)
    private readonly hrmsSettingsRepository: Repository<HrmsSettings>,
  ) {}

  @Get('dependencies')
  async getDependencies(
    @Req() req: Request & { workspaceMember?: { id: string }; workspace?: { id: string } },
  ) {
    const memberId = req.workspaceMember?.id;
    const workspaceId = req.workspace?.id;
    if (!memberId) {
      return createSuccessResponse('Dependencies retrieved', {
        hrmsUser: null,
        employee: null,
        openAttendance: null,
        leaveRequests: [],
        hrmsSettings: null,
      });
    }

    const hrmsUser = await this.hrmsUserRepository.findOne({
      where: { memberId },
    });

    const employee = await this.employeeRepository.findOne({
      where: { memberId },
    });

    const openAttendance = await this.attendanceRepository.findOne({
      where: { memberId, status: 'open' },
    });

    const leaveRequests = await this.leaveRequestRepository.find({
      where: { memberId },
      order: { createdAt: 'DESC' },
      take: 10,
    });

    const pendingLeaveRequest = await this.leaveRequestRepository.findOne({
      where: { memberId, status: LeaveStatus.PENDING },
    });

    const recentAttendance = await this.attendanceRepository.find({
      where: { memberId },
      order: { clockIn: 'DESC' },
      take: 10,
    });

    const hrmsSettings = workspaceId
      ? await this.hrmsSettingsRepository.findOne({
          where: { workspaceId },
        })
      : null;

    const totalAttendanceHoursResult = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .select('SUM(attendance.totalHours)', 'total')
      .where('attendance.memberId = :memberId', { memberId })
      .andWhere('attendance.status = :status', { status: 'closed' })
      .getRawOne();

    const totalAttendanceHours = totalAttendanceHoursResult?.total 
      ? parseFloat(totalAttendanceHoursResult.total) 
      : 0;

    const approvedLeaveDays = await this.leaveRequestRepository
      .createQueryBuilder('leave')
      .select('leave')
      .where('leave.memberId = :memberId', { memberId })
      .andWhere('leave.status = :status', { status: 'approved' })
      .getMany();

    const totalLeaveDaysUsed = approvedLeaveDays.reduce((total, leave) => {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return total + days;
    }, 0);

    const annualLeaveEntitlement = 20;
    const leaveBalance = annualLeaveEntitlement - totalLeaveDaysUsed;

    return createSuccessResponse('Dependencies retrieved', {
      hrmsUser,
      employee,
      openAttendance,
      leaveRequests,
      recentAttendance,
      hrmsSettings,
      totalAttendanceHours,
      leaveBalance,
      pendingLeaveRequest,
    });
  }
}
