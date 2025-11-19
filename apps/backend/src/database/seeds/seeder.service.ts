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
import { Space } from '../../modules/apps/spaces/schemas/space.schema';
import { List } from '../../modules/apps/spaces/lists/schemas/list.schema';
import { SpaceParticipant } from '../../modules/apps/spaces/space-participants/schemas/space-participant.schema';
import { Task } from '../../modules/apps/spaces/tasks/schemas/task.schema';
import { Checklist } from '../../modules/checklists/schemas/checklist.schema';
import { SeedData } from './seed.interface';
import { getDevelopmentSeedData } from './data/development.seed';
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
    @InjectRepository(Space)
    private readonly spaceRepository: Repository<Space>,
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    @InjectRepository(SpaceParticipant)
    private readonly spaceParticipantRepository: Repository<SpaceParticipant>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Checklist)
    private readonly checklistRepository: Repository<Checklist>,
  ) {}

  async seed(environment: 'development' | 'production' = 'development') {
    this.logger.log(`Starting ${environment} database seeding...`);

    const seedData =
      environment === 'production' ? productionSeedData : await getDevelopmentSeedData();

    try {
      await this.clearDatabase();

      await this.seedUsers(seedData);
      await this.seedWorkspaces(seedData);
      await this.seedWorkspaceMembers(seedData);
      await this.seedRoles(seedData);
      await this.seedTeams(seedData);
      await this.seedOffices(seedData);
      await this.seedClients(seedData);
      
      if (environment === 'development') {
        await this.seedSpaces(seedData);
        await this.seedLists(seedData);
        await this.seedSpaceParticipants(seedData);
        await this.seedTasks(seedData);
      }

      this.logger.log(`${environment} database seeding completed successfully!`);
      return { success: true, environment };
    } catch (error) {
      this.logger.error(`Seeding failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async clearDatabase() {
    this.logger.log('Clearing existing data...');

    await this.checklistRepository.createQueryBuilder().delete().execute();
    await this.taskRepository.createQueryBuilder().delete().execute();
    await this.spaceParticipantRepository.createQueryBuilder().delete().execute();
    await this.listRepository.createQueryBuilder().delete().execute();
    await this.spaceRepository.createQueryBuilder().delete().execute();
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

  private async seedSpaces(seedData: SeedData) {
    if (!seedData.spaces || seedData.spaces.length === 0) {
      return;
    }

    this.logger.log(`Seeding ${seedData.spaces.length} spaces...`);

    for (const spaceData of seedData.spaces) {
      const workspace = await this.workspaceRepository.findOne({
        where: { slug: spaceData.workspaceSlug },
      });

      if (!workspace) {
        this.logger.warn(
          `Workspace ${spaceData.workspaceSlug} not found for space ${spaceData.name}`,
        );
        continue;
      }

      const creator = await this.userRepository.findOne({
        where: { email: spaceData.createdByEmail },
      });

      if (!creator) {
        this.logger.warn(
          `Creator ${spaceData.createdByEmail} not found for space ${spaceData.name}`,
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
          `Creator member not found for space ${spaceData.name}`,
        );
        continue;
      }

      const space = this.spaceRepository.create({
        name: spaceData.name,
        description: spaceData.description,
        color: spaceData.color,
        icon: spaceData.icon,
        workspaceId: workspace.id,
        createdById: creatorMember.id,
        isPublic: spaceData.isPublic ?? false,
        isDeleted: false,
      });

      await this.spaceRepository.save(space);
      this.logger.log(`Created space: ${spaceData.name}`);
    }
  }

  private async seedLists(seedData: SeedData) {
    if (!seedData.lists || seedData.lists.length === 0) {
      return;
    }

    this.logger.log(`Seeding ${seedData.lists.length} lists...`);

    for (const listData of seedData.lists) {
      const workspace = await this.workspaceRepository.findOne({
        where: { slug: listData.workspaceSlug },
      });

      if (!workspace) {
        this.logger.warn(
          `Workspace ${listData.workspaceSlug} not found for list ${listData.name}`,
        );
        continue;
      }

      const space = await this.spaceRepository.findOne({
        where: {
          name: listData.spaceName,
          workspaceId: workspace.id,
        },
      });

      if (!space) {
        this.logger.warn(
          `Space ${listData.spaceName} not found for list ${listData.name}`,
        );
        continue;
      }

      const list = this.listRepository.create({
        name: listData.name,
        description: listData.description,
        workspaceId: workspace.id,
        spaceId: space.id,
        isPrivate: listData.isPrivate ?? false,
        isDeleted: false,
      });

      await this.listRepository.save(list);
      this.logger.log(`Created list: ${listData.name}`);
    }
  }

  private async seedSpaceParticipants(seedData: SeedData) {
    if (!seedData.spaceParticipants || seedData.spaceParticipants.length === 0) {
      return;
    }

    this.logger.log(`Seeding ${seedData.spaceParticipants.length} space participants...`);

    for (const participantData of seedData.spaceParticipants) {
      const workspace = await this.workspaceRepository.findOne({
        where: { slug: participantData.workspaceSlug },
      });

      if (!workspace) {
        this.logger.warn(
          `Workspace ${participantData.workspaceSlug} not found for participant`,
        );
        continue;
      }

      const space = await this.spaceRepository.findOne({
        where: {
          name: participantData.spaceName,
          workspaceId: workspace.id,
        },
      });

      if (!space) {
        this.logger.warn(
          `Space ${participantData.spaceName} not found for participant`,
        );
        continue;
      }

      const user = await this.userRepository.findOne({
        where: { email: participantData.memberEmail },
      });

      if (!user) {
        this.logger.warn(
          `User ${participantData.memberEmail} not found for participant`,
        );
        continue;
      }

      const member = await this.workspaceMemberRepository.findOne({
        where: {
          userId: user.id,
          workspaceId: workspace.id,
        },
      });

      if (!member) {
        this.logger.warn(
          `Member ${participantData.memberEmail} not found in workspace`,
        );
        continue;
      }

      const participant = this.spaceParticipantRepository.create({
        memberId: member.id,
        workspaceId: workspace.id,
        spaceId: space.id,
        permissions: participantData.permissions as any,
        status: (participantData.status || 'active') as any,
      });

      await this.spaceParticipantRepository.save(participant);
      this.logger.log(`Created space participant: ${participantData.memberEmail} in ${participantData.spaceName}`);
    }
  }

  private async seedTasks(seedData: SeedData) {
    if (!seedData.tasks || seedData.tasks.length === 0) {
      return;
    }

    this.logger.log(`Seeding ${seedData.tasks.length} tasks...`);

    for (const taskData of seedData.tasks) {
      const workspace = await this.workspaceRepository.findOne({
        where: { slug: taskData.workspaceSlug },
      });

      if (!workspace) {
        this.logger.warn(
          `Workspace ${taskData.workspaceSlug} not found for task ${taskData.name}`,
        );
        continue;
      }

      const space = await this.spaceRepository.findOne({
        where: {
          name: taskData.spaceName,
          workspaceId: workspace.id,
        },
      });

      if (!space) {
        this.logger.warn(
          `Space ${taskData.spaceName} not found for task ${taskData.name}`,
        );
        continue;
      }

      const list = await this.listRepository.findOne({
        where: {
          name: taskData.listName,
          spaceId: space.id,
        },
      });

      if (!list) {
        this.logger.warn(
          `List ${taskData.listName} not found for task ${taskData.name}`,
        );
        continue;
      }

      const creator = await this.userRepository.findOne({
        where: { email: taskData.createdByEmail },
      });

      if (!creator) {
        this.logger.warn(
          `Creator ${taskData.createdByEmail} not found for task ${taskData.name}`,
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
          `Creator member not found for task ${taskData.name}`,
        );
        continue;
      }

      const assigneeIds: string[] = [];
      if (taskData.assigneeEmails && taskData.assigneeEmails.length > 0) {
        for (const email of taskData.assigneeEmails) {
          const assigneeUser = await this.userRepository.findOne({
            where: { email },
          });

          if (assigneeUser) {
            const assigneeMember = await this.workspaceMemberRepository.findOne({
              where: {
                userId: assigneeUser.id,
                workspaceId: workspace.id,
              },
            });

            if (assigneeMember) {
              assigneeIds.push(assigneeMember.id);
            }
          }
        }
      }

      const taskCount = await this.taskRepository.count({
        where: { workspaceId: workspace.id },
      });

      const task = this.taskRepository.create({
        name: taskData.name,
        description: taskData.description,
        task_id: `TSK-${taskCount + 1}`,
        listId: list.id,
        spaceId: space.id,
        workspaceId: workspace.id,
        createdById: creatorMember.id,
        priority: taskData.priority as any,
        status: taskData.status as any,
        timeframe: taskData.timeframe ? {
          start: taskData.timeframe.start ? new Date(taskData.timeframe.start) : undefined,
          end: taskData.timeframe.end ? new Date(taskData.timeframe.end) : undefined,
        } : undefined,
        assigneeIds: assigneeIds,
        estimatedHours: taskData.estimatedHours,
        progress: taskData.progress || 0,
        tags: taskData.tags || [],
        completedAt: taskData.completedAt ? new Date(taskData.completedAt) : undefined,
        startedAt: taskData.startedAt ? new Date(taskData.startedAt) : undefined,
        statusChangedAt: taskData.status === 'completed' && taskData.completedAt 
          ? new Date(taskData.completedAt) 
          : taskData.status === 'in_progress' && taskData.startedAt
          ? new Date(taskData.startedAt)
          : undefined,
        isDeleted: false,
      });

      await this.taskRepository.save(task);
      this.logger.log(`Created task: ${task.task_id} - ${taskData.name}`);
    }
  }
}
