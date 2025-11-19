import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../../modules/users/schemas/user.schema';
import { UserSecrets } from '../../modules/users/schemas/user-secrets.schema';
import { Workspace } from '../../modules/workspaces/schemas/workspace.schema';
import { WorkspaceMember } from '../../modules/workspace-members/schemas/workspace-member.schema';
import { WorkspaceMemberSecrets } from '../../modules/workspace-members/schemas/workspace-member-secrets.schema';
import { Role } from '../../modules/options/roles/schemas/role.schema';
import { Team } from '../../modules/options/teams/schemas/team.schema';
import { Office } from '../../modules/options/offices/schemas/office.schema';
import { Client } from '../../modules/options/clients/schemas/client.schema';
import { parseAndValidateAppKey } from '../../lib/app-key-validator';
import { ConfigService } from '@nestjs/config';

interface DefaultWorkspaceMember {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  bio?: string;
}

interface WorkspaceInfo {
  id: string;
  name: string;
  slug: string;
  defaultMember: DefaultWorkspaceMember;
}

interface OrganizationInfo {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  country?: string;
}

interface AppKeyData {
  organization: OrganizationInfo;
  workspace: WorkspaceInfo;
  license: {
    expiresAt: Date;
    numberOfSeats: number;
  };
  billing: {
    amount: number;
    paymentFrequency: 'monthly' | 'yearly';
    gateway: 'paystack' | 'stripe';
  };
  deployment: {
    flyApiKey: string;
    appName: string;
    domain: string;
  };
  createdAt: string;
  version: string;
}

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserSecrets)
    private readonly userSecretsRepository: Repository<UserSecrets>,
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(WorkspaceMember)
    private readonly workspaceMemberRepository: Repository<WorkspaceMember>,
    @InjectRepository(WorkspaceMemberSecrets)
    private readonly workspaceMemberSecretsRepository: Repository<WorkspaceMemberSecrets>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(Office)
    private readonly officeRepository: Repository<Office>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly configService: ConfigService,
  ) {}

  async seedFromAppKey() {
    this.logger.log('Starting APP_KEY-based database seeding...');

    try {
      // Check if workspace already exists
      const existingWorkspaceCount = await this.workspaceRepository.count();
      if (existingWorkspaceCount > 0) {
        this.logger.log('Workspace already exists, skipping seeding');
        return { success: true, message: 'Workspace already exists' };
      }

      // Get and validate APP_KEY
      const appKeyToken = this.configService.get<string>('APP_KEY');
      const appKeySecret = this.configService.get<string>('APP_KEY_SECRET') || 'your-secret-key-change-in-production';
      
      if (!appKeyToken) {
        throw new Error('APP_KEY environment variable is required');
      }

      const validation = parseAndValidateAppKey(appKeyToken, appKeySecret);
      if (!validation.success) {
        throw new Error(`Invalid APP_KEY: ${validation.error}`);
      }

      const appData = validation.data;

      // Create workspace and default member
      const { workspace, workspaceMember } = await this.createWorkspaceFromAppKey(appData);
      await this.createDefaultRoles(appData, workspace, workspaceMember);
      await this.createDefaultTeams(appData, workspace, workspaceMember);
      await this.createDefaultOffices(appData, workspace, workspaceMember);

      this.logger.log('APP_KEY-based database seeding completed successfully!');
      return { success: true, message: 'Seeding completed' };
    } catch (error) {
      this.logger.error(`Seeding failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async createWorkspaceFromAppKey(appData: AppKeyData) {
    this.logger.log('Creating workspace and default member from APP_KEY...');

    // Create user for the default member
    const user = this.userRepository.create({
      email: appData.workspace.defaultMember.email,
      timezone: 'UTC',
      isEmailVerified: true,
    });

    const savedUser = await this.userRepository.save(user);

    // Create user secrets
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(appData.workspace.defaultMember.password, salt);

    const userSecrets = this.userSecretsRepository.create({
      userId: savedUser.id,
      passwordHash,
      passwordSalt: salt,
    });

    await this.userSecretsRepository.save(userSecrets);

    // Create workspace
    const workspace = this.workspaceRepository.create({
      name: appData.workspace.name,
      description: `${appData.organization.name} workspace`,
      slug: appData.workspace.slug,
      createdById: savedUser.id,
    });

    const savedWorkspace = await this.workspaceRepository.save(workspace);

    // Create workspace member
    const workspaceMember = this.workspaceMemberRepository.create({
      userId: savedUser.id,
      workspaceId: savedWorkspace.id,
      firstName: appData.workspace.defaultMember.firstName,
      lastName: appData.workspace.defaultMember.lastName,
      primaryEmail: appData.workspace.defaultMember.email,
      workPhone: appData.workspace.defaultMember.phone || null,
      bio: appData.workspace.defaultMember.bio || null,
      status: 'active' as any,
      avatarURL: { sm: '', original: '' },
    });

    const savedWorkspaceMember = await this.workspaceMemberRepository.save(workspaceMember);

    // Create workspace member secrets (password for the member)
    const memberSecrets = this.workspaceMemberSecretsRepository.create({
      workspaceMemberId: savedWorkspaceMember.id,
      passwordHash,
      passwordSalt: salt,
      passwordChangedAt: new Date(),
    });

    await this.workspaceMemberSecretsRepository.save(memberSecrets);

    this.logger.log(`Created workspace: ${savedWorkspace.name}`);
    this.logger.log(`Created default member: ${savedWorkspaceMember.firstName} ${savedWorkspaceMember.lastName}`);

    return { workspace: savedWorkspace, workspaceMember: savedWorkspaceMember };
  }

  private async createDefaultRoles(appData: AppKeyData, workspace: Workspace, creatorMember: WorkspaceMember) {
    this.logger.log('Creating default roles...');

    const defaultRoles = [
      { name: 'Administrator', description: 'Full access to all features and settings' },
      { name: 'Manager', description: 'Can manage teams and projects' },
      { name: 'Employee', description: 'Standard user access' },
    ];

    for (const roleData of defaultRoles) {
      const role = this.roleRepository.create({
        name: roleData.name,
        description: roleData.description,
        workspaceId: workspace.id,
        createdById: creatorMember.id,
        isActive: true,
        isDeleted: false,
      });

      await this.roleRepository.save(role);
      this.logger.log(`Created role: ${roleData.name}`);
    }
  }

  private async createDefaultTeams(appData: AppKeyData, workspace: Workspace, creatorMember: WorkspaceMember) {
    this.logger.log('Creating default teams...');

    const defaultTeams = [
      { name: 'General', description: 'Default team for all members' },
      { name: 'Management', description: 'Management team' },
    ];

    for (const teamData of defaultTeams) {
      const team = this.teamRepository.create({
        name: teamData.name,
        description: teamData.description,
        workspaceId: workspace.id,
        createdById: creatorMember.id,
        isActive: true,
        isDeleted: false,
      });

      await this.teamRepository.save(team);
      this.logger.log(`Created team: ${teamData.name}`);
    }
  }

  private async createDefaultOffices(appData: AppKeyData, workspace: Workspace, creatorMember: WorkspaceMember) {
    this.logger.log('Creating default offices...');

    const defaultOffices = [
      { name: 'Main Office', description: `${appData.organization.name} main office` },
      { name: 'Remote', description: 'Remote work location' },
    ];

    for (const officeData of defaultOffices) {
      const office = this.officeRepository.create({
        name: officeData.name,
        description: officeData.description,
        workspaceId: workspace.id,
        createdById: creatorMember.id,
        isActive: true,
        isDeleted: false,
      });

      await this.officeRepository.save(office);
      this.logger.log(`Created office: ${officeData.name}`);
    }
  }
}