import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeEntry } from './schemas/time-entry.schema';
import { TimeEntryService } from './services/time-entry.service';
import { TimeEntryController } from './time-entry.controller';
import { WorkspaceMembersModule } from '../../workspace-members/workspace-members.module';
import { AuthModule } from '../../auth/auth.module';
import { WorkspacesModule } from '../../workspaces/workspaces.module';
import { ProjectsModule } from '../../projects/projects.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([TimeEntry]),
        WorkspaceMembersModule,
        AuthModule,
        WorkspacesModule,
        ProjectsModule,
    ],
    controllers: [TimeEntryController],
    providers: [TimeEntryService],
    exports: [TimeEntryService, TypeOrmModule],
})
export class TimeTrackerModule { }
