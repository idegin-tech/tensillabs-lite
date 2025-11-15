import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HrmsSettings } from './schemas/hrms-settings.schema';
import { HrmsSettingsService } from './services/hrms-settings.service';
import { HrmsController } from './hrms.controller';
import { Attendance } from './attendance/schemas/attendance.schema';
import { AttendanceController } from './attendance/attendance.controller';
import { HrmsUser } from './hrms-user/hrms-user.schema';
import { Employee } from './employees/employee.schema';
import { LeaveRequest } from './leave-requests/schemas/leave-request.schema';
import { AuthModule } from '../../auth/auth.module';
import { WorkspaceMembersModule } from '../../workspace-members/workspace-members.module';
import { WorkspacesModule } from '../../workspaces/workspaces.module';

@Module({
  imports: [
    AuthModule,
    WorkspaceMembersModule,
    WorkspacesModule,
    TypeOrmModule.forFeature([
      HrmsSettings,
      Attendance,
      HrmsUser,
      Employee,
      LeaveRequest,
    ]),
  ],
  controllers: [HrmsController, AttendanceController],
  providers: [HrmsSettingsService],
  exports: [HrmsSettingsService],
})
export class HrmsModule {}
