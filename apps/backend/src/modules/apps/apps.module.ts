import { Module } from '@nestjs/common';
import { SpacesModule } from './spaces/spaces.module';
import { TimeTrackerModule } from './time-tracker/time-tracker.module';
import { HrmsModule } from './hrms/hrms.module';

@Module({
  imports: [SpacesModule, TimeTrackerModule, HrmsModule],
  exports: [SpacesModule, TimeTrackerModule, HrmsModule],
})
export class AppsModule {}
