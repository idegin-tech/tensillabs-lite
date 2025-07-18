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
import { Types } from 'mongoose';
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
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { validateHRMSUser } from '../hrms-user/guards/hrms-user.guard';
import { HrmsUserPermission } from '../hrms-user/hrms-user.schema';

@Controller('hrms/attendance')
@UseGuards(AuthGuard, WorkspaceMemberGuard)
export class AttendanceController {
  constructor(
    @InjectModel(Attendance.name)
    private readonly attendanceModel: Model<Attendance>,
  ) {}

  @Post()
  async toggleAttendance(
    @Body(new ZodValidationPipe(toggleAttendanceSchema))
    toggleAttendanceDto: ToggleAttendanceDto,
    @Req() req: Request & { workspaceMember?: { _id: string | Types.ObjectId } },
    @Headers('x-user-datetime') xUserDateTime: string,
  ) {
    if (!xUserDateTime) {
      throw new BadRequestException('X-User-DateTime header is required');
    }
    const dateTime = new Date(xUserDateTime);
    if (isNaN(dateTime.getTime())) {
      throw new BadRequestException('Invalid X-User-DateTime format');
    }

    const workspaceMemberId = req.workspaceMember && req.workspaceMember._id
      ? typeof req.workspaceMember._id === 'string'
        ? new Types.ObjectId(req.workspaceMember._id)
        : req.workspaceMember._id
      : undefined;
    if (!workspaceMemberId) {
      throw new BadRequestException('Workspace member ID is required');
    }
    const startOfDay = new Date(dateTime);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(dateTime);
    endOfDay.setHours(23, 59, 59, 999);
    const filter: Record<string, unknown> = {
      member: workspaceMemberId,
      status: 'open',
      clockIn: { $gte: startOfDay, $lte: endOfDay },
    };
    if (toggleAttendanceDto.office) {
      filter.office = Types.ObjectId.isValid(toggleAttendanceDto.office)
        ? new Types.ObjectId(toggleAttendanceDto.office)
        : toggleAttendanceDto.office;
    }
    let attendance = await this.attendanceModel.findOne(filter);
    if (!attendance) {
      attendance = await this.attendanceModel.create({
        member: workspaceMemberId,
        office: toggleAttendanceDto.office
          ? (Types.ObjectId.isValid(toggleAttendanceDto.office)
            ? new Types.ObjectId(toggleAttendanceDto.office)
            : toggleAttendanceDto.office)
          : undefined,
        clockIn: dateTime,
        remarks: toggleAttendanceDto.remarks,
        status: 'open',
      });
      return createSuccessResponse('Clocked in', attendance);
    } else if (!attendance.clockOut) {
      attendance.clockOut = dateTime;
      attendance.status = 'closed';
      if (toggleAttendanceDto.remarks) attendance.remarks = toggleAttendanceDto.remarks;
      await attendance.save();
      return createSuccessResponse('Clocked out', attendance);
    } else {
      return createSuccessResponse('Already clocked out for today', attendance);
    }
  }

  @Get()
  @UseGuards(validateHRMSUser([HrmsUserPermission.ADMIN, HrmsUserPermission.MANAGER]))
  async getAttendances(
    @Req() req: Request & { workspaceMember?: { _id: string | Types.ObjectId }, workspace?: { _id: string | Types.ObjectId } },
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
    const workspaceMemberId = req.workspaceMember && req.workspaceMember._id
      ? typeof req.workspaceMember._id === 'string'
        ? new Types.ObjectId(req.workspaceMember._id)
        : req.workspaceMember._id
      : undefined;
    if (!workspaceMemberId) {
      throw new BadRequestException('Workspace member ID is required');
    }
    const filter: Record<string, unknown> = {
      clockIn: { $gte: startOfDay, $lte: endOfDay },
    };
    if (req.workspace && req.workspace._id) {
      filter.workspace = typeof req.workspace._id === 'string'
        ? new Types.ObjectId(req.workspace._id)
        : req.workspace._id;
    }
    const [attendances, total] = await Promise.all([
      this.attendanceModel
        .find(filter)
        .sort({ clockIn: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      this.attendanceModel.countDocuments(filter),
    ]);
    return createSuccessResponse('Attendances retrieved', {
      data: attendances,
      total,
      page: pageNum,
      limit: limitNum,
      hasMore: pageNum * limitNum < total,
    });
  }
}
