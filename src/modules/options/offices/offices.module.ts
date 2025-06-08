import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OfficeController } from './office.controller';
import { OfficeService } from './services/office.service';
import { Office, OfficeSchema } from './schemas/office.schema';
import { WorkspaceMembersModule } from '../../workspace-members/workspace-members.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Office.name, schema: OfficeSchema }]),
    WorkspaceMembersModule,
  ],
  controllers: [OfficeController],
  providers: [OfficeService],
  exports: [OfficeService, MongooseModule],
})
export class OfficesModule {}
