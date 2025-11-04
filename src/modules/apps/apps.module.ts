import { Module } from '@nestjs/common';
import { SpacesModule } from './spaces/spaces.module';
import { TimeTrackerModule } from './time-tracker/time-tracker.module';

@Module({
  imports: [SpacesModule, TimeTrackerModule],
  exports: [SpacesModule, TimeTrackerModule],
})
export class AppsModule {}
