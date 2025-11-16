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
import { LeaveRequestController } from './leave-requests/leave-request.controller';
import { LeaveRequestService } from './leave-requests/services/leave-request.service';
import { AuthModule } from '../../auth/auth.module';
import { WorkspaceMembersModule } from '../../workspace-members/workspace-members.module';
import { WorkspacesModule } from '../../workspaces/workspaces.module';
import { CommentsModule } from '../../comments/comments.module';
import { FilesModule } from '../../files/files.module';

@Module({
  imports: [
    AuthModule,
    WorkspaceMembersModule,
    WorkspacesModule,
    CommentsModule,
    FilesModule,
    TypeOrmModule.forFeature([
      HrmsSettings,
      Attendance,
      HrmsUser,
      Employee,
      LeaveRequest,
    ]),
  ],
  controllers: [HrmsController, AttendanceController, LeaveRequestController],
  providers: [HrmsSettingsService, LeaveRequestService],
  exports: [HrmsSettingsService, LeaveRequestService],
})
export class HrmsModule {}
