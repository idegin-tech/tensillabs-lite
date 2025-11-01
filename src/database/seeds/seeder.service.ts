import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../../modules/users/schemas/user.schema';
import { UserSecrets } from '../../modules/users/schemas/user-secrets.schema';
import { Workspace } from '../../modules/workspaces/schemas/workspace.schema';
import { WorkspaceMember } from '../../modules/workspace-members/schemas/workspace-member.schema';
import { Role } from '../../modules/options/roles/schemas/role.schema';
import { Team } from '../../modules/options/teams/schemas/team.schema';
import { Office } from '../../modules/options/offices/schemas/office.schema';
import { Client } from '../../modules/options/clients/schemas/client.schema';
import { SeedData } from './seed.interface';
import { developmentSeedData } from './data/development.seed';
import { productionSeedData } from './data/production.seed';

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
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(Office)
    private readonly officeRepository: Repository<Office>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async seed(environment: 'development' | 'production' = 'development') {
    this.logger.log(`Starting ${environment} database seeding...`);

    const seedData =
      environment === 'production' ? productionSeedData : developmentSeedData;

    try {
      await this.clearDatabase();

      await this.seedUsers(seedData);
      await this.seedWorkspaces(seedData);
      await this.seedWorkspaceMembers(seedData);
      await this.seedRoles(seedData);
      await this.seedTeams(seedData);
      await this.seedOffices(seedData);
      await this.seedClients(seedData);

      this.logger.log(`${environment} database seeding completed successfully!`);
      return { success: true, environment };
    } catch (error) {
      this.logger.error(`Seeding failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async clearDatabase() {
    this.logger.log('Clearing existing data...');

    await this.clientRepository.createQueryBuilder().delete().execute();
    await this.officeRepository.createQueryBuilder().delete().execute();
    await this.teamRepository.createQueryBuilder().delete().execute();
    await this.roleRepository.createQueryBuilder().delete().execute();
    await this.workspaceMemberRepository.createQueryBuilder().delete().execute();
    await this.workspaceRepository.createQueryBuilder().delete().execute();
    await this.userSecretsRepository.createQueryBuilder().delete().execute();
    await this.userRepository.createQueryBuilder().delete().execute();

    this.logger.log('Database cleared successfully');
  }

  private async seedUsers(seedData: SeedData) {
    this.logger.log(`Seeding ${seedData.users.length} users...`);

    for (const userData of seedData.users) {
      const existingUser = await this.userRepository.findOne({
        where: { email: userData.email },
      });

      if (existingUser) {
        this.logger.warn(`User ${userData.email} already exists, skipping...`);
        continue;
      }

      const user = this.userRepository.create({
        email: userData.email,
        timezone: userData.timezone || 'Africa/Lagos',
        isEmailVerified: userData.isEmailVerified ?? false,
      });

      const savedUser = await this.userRepository.save(user);

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(userData.password, salt);

      const userSecrets = this.userSecretsRepository.create({
        userId: savedUser.id,
        passwordHash,
        passwordSalt: salt,
      });

      await this.userSecretsRepository.save(userSecrets);

      this.logger.log(`Created user: ${userData.email}`);
    }
  }

  private async seedWorkspaces(seedData: SeedData) {
    this.logger.log(`Seeding ${seedData.workspaces.length} workspaces...`);

    for (const workspaceData of seedData.workspaces) {
      const creator = await this.userRepository.findOne({
        where: { email: workspaceData.createdByEmail },
      });

      if (!creator) {
        this.logger.warn(
          `Creator ${workspaceData.createdByEmail} not found for workspace ${workspaceData.name}`,
        );
        continue;
      }

      const existingWorkspace = await this.workspaceRepository.findOne({
        where: { slug: workspaceData.slug },
      });

      if (existingWorkspace) {
        this.logger.warn(
          `Workspace ${workspaceData.slug} already exists, skipping...`,
        );
        continue;
      }

      const workspace = this.workspaceRepository.create({
        name: workspaceData.name,
        description: workspaceData.description,
        slug: workspaceData.slug,
        createdById: creator.id,
      });

      await this.workspaceRepository.save(workspace);
      this.logger.log(`Created workspace: ${workspaceData.name}`);
    }
  }

  private async seedWorkspaceMembers(seedData: SeedData) {
    this.logger.log(
      `Seeding ${seedData.workspaceMembers.length} workspace members...`,
    );

    for (const memberData of seedData.workspaceMembers) {
      const user = await this.userRepository.findOne({
        where: { email: memberData.userEmail },
      });

      const workspace = await this.workspaceRepository.findOne({
        where: { slug: memberData.workspaceSlug },
      });

      if (!user) {
        this.logger.warn(
          `User ${memberData.userEmail} not found for member creation`,
        );
        continue;
      }

      if (!workspace) {
        this.logger.warn(
          `Workspace ${memberData.workspaceSlug} not found for member creation`,
        );
        continue;
      }

      const existingMember = await this.workspaceMemberRepository.findOne({
        where: {
          userId: user.id,
          workspaceId: workspace.id,
        },
      });

      if (existingMember) {
        this.logger.warn(
          `Member ${memberData.userEmail} already exists in workspace ${memberData.workspaceSlug}`,
        );
        continue;
      }

      const member = this.workspaceMemberRepository.create({
        userId: user.id,
        workspaceId: workspace.id,
        firstName: memberData.firstName,
        middleName: memberData.middleName || null,
        lastName: memberData.lastName,
        primaryEmail: memberData.primaryEmail,
        secondaryEmail: memberData.secondaryEmail || null,
        permission: memberData.permission as any,
        bio: memberData.bio || null,
        workPhone: memberData.workPhone || null,
        mobilePhone: memberData.mobilePhone || null,
        status: (memberData.status || 'active') as any,
        avatarURL: { sm: '', original: '' },
      });

      await this.workspaceMemberRepository.save(member);
      this.logger.log(
        `Created member: ${memberData.firstName} ${memberData.lastName} in ${memberData.workspaceSlug}`,
      );
    }
  }

  private async seedRoles(seedData: SeedData) {
    this.logger.log(`Seeding ${seedData.roles.length} roles...`);

    for (const roleData of seedData.roles) {
      const workspace = await this.workspaceRepository.findOne({
        where: { slug: roleData.workspaceSlug },
      });

      if (!workspace) {
        this.logger.warn(
          `Workspace ${roleData.workspaceSlug} not found for role ${roleData.name}`,
        );
        continue;
      }

      const creator = await this.userRepository.findOne({
        where: { email: roleData.createdByEmail },
      });

      if (!creator) {
        this.logger.warn(
          `Creator ${roleData.createdByEmail} not found for role ${roleData.name}`,
        );
        continue;
      }

      const creatorMember = await this.workspaceMemberRepository.findOne({
        where: {
          userId: creator.id,
          workspaceId: workspace.id,
        },
      });

      if (!creatorMember) {
        this.logger.warn(
          `Creator member not found for role ${roleData.name}`,
        );
        continue;
      }

      const role = this.roleRepository.create({
        name: roleData.name,
        description: roleData.description,
        workspaceId: workspace.id,
        createdById: creatorMember.id,
        isActive: roleData.isActive ?? true,
        isDeleted: false,
      });

      await this.roleRepository.save(role);
      this.logger.log(`Created role: ${roleData.name}`);
    }
  }

  private async seedTeams(seedData: SeedData) {
    this.logger.log(`Seeding ${seedData.teams.length} teams...`);

    for (const teamData of seedData.teams) {
      const workspace = await this.workspaceRepository.findOne({
        where: { slug: teamData.workspaceSlug },
      });

      if (!workspace) {
        this.logger.warn(
          `Workspace ${teamData.workspaceSlug} not found for team ${teamData.name}`,
        );
        continue;
      }

      const creator = await this.userRepository.findOne({
        where: { email: teamData.createdByEmail },
      });

      if (!creator) {
        this.logger.warn(
          `Creator ${teamData.createdByEmail} not found for team ${teamData.name}`,
        );
        continue;
      }

      const creatorMember = await this.workspaceMemberRepository.findOne({
        where: {
          userId: creator.id,
          workspaceId: workspace.id,
        },
      });

      if (!creatorMember) {
        this.logger.warn(
          `Creator member not found for team ${teamData.name}`,
        );
        continue;
      }

      const team = this.teamRepository.create({
        name: teamData.name,
        description: teamData.description,
        workspaceId: workspace.id,
        createdById: creatorMember.id,
        isActive: teamData.isActive ?? true,
        isDeleted: false,
      });

      await this.teamRepository.save(team);
      this.logger.log(`Created team: ${teamData.name}`);
    }
  }

  private async seedOffices(seedData: SeedData) {
    this.logger.log(`Seeding ${seedData.offices.length} offices...`);

    for (const officeData of seedData.offices) {
      const workspace = await this.workspaceRepository.findOne({
        where: { slug: officeData.workspaceSlug },
      });

      if (!workspace) {
        this.logger.warn(
          `Workspace ${officeData.workspaceSlug} not found for office ${officeData.name}`,
        );
        continue;
      }

      const creator = await this.userRepository.findOne({
        where: { email: officeData.createdByEmail },
      });

      if (!creator) {
        this.logger.warn(
          `Creator ${officeData.createdByEmail} not found for office ${officeData.name}`,
        );
        continue;
      }

      const creatorMember = await this.workspaceMemberRepository.findOne({
        where: {
          userId: creator.id,
          workspaceId: workspace.id,
        },
      });

      if (!creatorMember) {
        this.logger.warn(
          `Creator member not found for office ${officeData.name}`,
        );
        continue;
      }

      const office = this.officeRepository.create({
        name: officeData.name,
        description: officeData.description,
        workspaceId: workspace.id,
        createdById: creatorMember.id,
        isActive: officeData.isActive ?? true,
        isDeleted: false,
      });

      await this.officeRepository.save(office);
      this.logger.log(`Created office: ${officeData.name}`);
    }
  }

  private async seedClients(seedData: SeedData) {
    this.logger.log(`Seeding ${seedData.clients.length} clients...`);

    for (const clientData of seedData.clients) {
      const workspace = await this.workspaceRepository.findOne({
        where: { slug: clientData.workspaceSlug },
      });

      if (!workspace) {
        this.logger.warn(
          `Workspace ${clientData.workspaceSlug} not found for client ${clientData.name}`,
        );
        continue;
      }

      const creator = await this.userRepository.findOne({
        where: { email: clientData.createdByEmail },
      });

      if (!creator) {
        this.logger.warn(
          `Creator ${clientData.createdByEmail} not found for client ${clientData.name}`,
        );
        continue;
      }

      const creatorMember = await this.workspaceMemberRepository.findOne({
        where: {
          userId: creator.id,
          workspaceId: workspace.id,
        },
      });

      if (!creatorMember) {
        this.logger.warn(
          `Creator member not found for client ${clientData.name}`,
        );
        continue;
      }

      const client = this.clientRepository.create({
        name: clientData.name,
        description: clientData.description,
        workspaceId: workspace.id,
        createdById: creatorMember.id,
        isActive: clientData.isActive ?? true,
        isDeleted: false,
      });

      await this.clientRepository.save(client);
      this.logger.log(`Created client: ${clientData.name}`);
    }
  }
}
