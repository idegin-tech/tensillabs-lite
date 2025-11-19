import { Module } from '@nestjs/common';
import { ClientsModule } from './clients/clients.module';
import { OfficesModule } from './offices/offices.module';
import { RolesModule } from './roles/roles.module';
import { TeamsModule } from './teams/teams.module';

@Module({
  imports: [ClientsModule, OfficesModule, RolesModule, TeamsModule],
  exports: [ClientsModule, OfficesModule, RolesModule, TeamsModule],
})
export class OptionsModule {}
