import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleController } from './role.controller';
import { RoleService } from './services/role.service';
import { Role, RoleSchema } from './schemas/role.schema';
import { WorkspaceMembersModule } from '../../workspace-members/workspace-members.module';
import { WorkspacesModule } from '../../workspaces/workspaces.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    WorkspaceMembersModule,
    forwardRef(() => WorkspacesModule),
    AuthModule,
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService, MongooseModule],
})
export class RolesModule {}
