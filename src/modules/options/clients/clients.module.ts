import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientController } from './client.controller';
import { ClientService } from './services/client.service';
import { Client, ClientSchema } from './schemas/client.schema';
import { WorkspaceMembersModule } from '../../workspace-members/workspace-members.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
    WorkspaceMembersModule,
  ],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService, MongooseModule],
})
export class ClientsModule {}
