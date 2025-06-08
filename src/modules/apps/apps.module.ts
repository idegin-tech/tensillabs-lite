import { Module } from '@nestjs/common';
import { SpacesModule } from './spaces/spaces.module';

@Module({
  imports: [SpacesModule],
  exports: [SpacesModule],
})
export class AppsModule {}
