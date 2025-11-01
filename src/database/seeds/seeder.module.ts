import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../modules/users/schemas/user.schema';
import { UserSecrets } from '../../modules/users/schemas/user-secrets.schema';
import { Workspace } from '../../modules/workspaces/schemas/workspace.schema';
import { WorkspaceMember } from '../../modules/workspace-members/schemas/workspace-member.schema';
import { Role } from '../../modules/options/roles/schemas/role.schema';
import { Team } from '../../modules/options/teams/schemas/team.schema';
import { Office } from '../../modules/options/offices/schemas/office.schema';
import { Client } from '../../modules/options/clients/schemas/client.schema';
import { SeederService } from './seeder.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            UserSecrets,
            Workspace,
            WorkspaceMember,
            Role,
            Team,
            Office,
            Client,
        ]),
    ],
    providers: [SeederService],
    exports: [SeederService],
})
export class SeederModule {}
