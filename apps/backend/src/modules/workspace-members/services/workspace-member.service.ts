/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import {
  WorkspaceMember,
  MemberStatus,
} from '../schemas/workspace-member.schema';
import { WorkspaceMemberSecrets } from '../schemas/workspace-member-secrets.schema';
import { InviteMemberDto } from '../dto/workspace-member.dto';
import { PaginationDto, extractPaginationOptions } from '../dto/pagination.dto';
import { workspaceInvitationEmail } from '../workspace-member.email';
import { useCTAMail } from '../../../lib/emil.lib';
import { APP_CONFIG } from '../../../config/app.config';
import { Workspace } from '../../workspaces/schemas/workspace.schema';
import { User } from '../../users/schemas/user.schema';
import { UserSecrets } from '../../users/schemas/user-secrets.schema';

@Injectable()
export class WorkspaceMemberService {
  constructor(
    @InjectRepository(WorkspaceMember)
    private workspaceMemberRepository: Repository<WorkspaceMember>,
    @InjectRepository(WorkspaceMemberSecrets)
    private workspaceMemberSecretsRepository: Repository<WorkspaceMemberSecrets>,
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserSecrets)
    private userSecretsRepository: Repository<UserSecrets>,
  ) {}

  async initializeWorkspaceOwner(
    userId: string,
    workspaceId: string,
    userEmail: string,
    firstName: string,
    lastName: string,
    middleName?: string,
  ): Promise<WorkspaceMember> {
    const workspaceMember = this.workspaceMemberRepository.create({
      userId,
      workspaceId,
      firstName,
      middleName: middleName || null,
      lastName,
      primaryEmail: userEmail,
      status: MemberStatus.ACTIVE,
      lastActiveAt: new Date(),
    });

    return await this.workspaceMemberRepository.save(workspaceMember);
  }

  async findByUserAndWorkspace(
    userId: string,
    workspaceId: string,
  ): Promise<WorkspaceMember | null> {
    return await this.workspaceMemberRepository.findOne({
      where: { userId, workspaceId },
    });
  }

  async findByWorkspace(
    workspaceId: string,
    pagination?: PaginationDto,
  ): Promise<any> {
    if (!pagination) {
      pagination = { page: 1, limit: 10, sortBy: '-createdAt' };
    }

    const { search, status, paginationOptions } =
      extractPaginationOptions(pagination);

    const where: any = {
      workspaceId,
    };

    if (status && status !== 'all') {
      where.status = status;
    }

    const queryBuilder =
      this.workspaceMemberRepository.createQueryBuilder('workspaceMember');

    queryBuilder.where(where);

    if (search) {
      queryBuilder.andWhere(
        '(workspaceMember.firstName ILIKE :search OR workspaceMember.lastName ILIKE :search OR workspaceMember.primaryEmail ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder.leftJoinAndSelect('workspaceMember.user', 'user');
    queryBuilder.select([
      'workspaceMember',
      'user.id',
      'user.email',
      'user.timezone',
      'user.isEmailVerified',
    ]);

    const page = paginationOptions.page || 1;
    const limit = paginationOptions.limit || 10;

    queryBuilder.skip((page - 1) * limit).take(limit);

    if (paginationOptions.sort) {
      const sortOrder = paginationOptions.sort.startsWith('-') ? 'DESC' : 'ASC';
      const sortField = paginationOptions.sort.replace('-', '');
      queryBuilder.orderBy(`workspaceMember.${sortField}`, sortOrder);
    }

    const [docs, totalDocs] = await queryBuilder.getManyAndCount();

    return {
      docs,
      totalDocs,
      limit,
      page,
      totalPages: Math.ceil(totalDocs / limit),
      hasNextPage: page < Math.ceil(totalDocs / limit),
      hasPrevPage: page > 1,
      nextPage: page < Math.ceil(totalDocs / limit) ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    };
  }

  async updateMember(
    memberId: string,
    updateData: Partial<WorkspaceMember>,
  ): Promise<WorkspaceMember | null> {
    await this.workspaceMemberRepository.update(memberId, updateData);
    return await this.workspaceMemberRepository.findOne({
      where: { id: memberId },
    });
  }

  async findById(memberId: string): Promise<WorkspaceMember | null> {
    return await this.workspaceMemberRepository.findOne({
      where: { id: memberId },
    });
  }

  async getMemberDependencies(memberId: string): Promise<any> {
    const member = await this.workspaceMemberRepository.findOne({
      where: { id: memberId },
      relations: ['user'],
    });

    if (!member) {
      return null;
    }

    const workspace = await this.workspaceRepository.findOne({
      where: { id: member.workspaceId },
      select: [
        'id',
        'name',
        'description',
        'logoURL',
        'bannerURL',
        'createdBy',
        'createdAt',
        'updatedAt',
      ],
    });

    return {
      member,
      workspace,
    };
  }

  async findByUserId(userId: string, pagination?: PaginationDto): Promise<any> {
    if (!pagination) {
      pagination = { page: 1, limit: 10, sortBy: '-createdAt' };
    }

    const { search, paginationOptions } = extractPaginationOptions(pagination);

    const where: any = {
      userId,
      status: MemberStatus.ACTIVE,
    };

    const queryBuilder =
      this.workspaceMemberRepository.createQueryBuilder('workspaceMember');

    queryBuilder.where(where);

    if (search) {
      queryBuilder.andWhere(
        '(workspaceMember.firstName ILIKE :search OR workspaceMember.lastName ILIKE :search OR workspaceMember.primaryEmail ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder.leftJoinAndSelect('workspaceMember.workspace', 'workspace');
    queryBuilder.select([
      'workspaceMember',
      'workspace.id',
      'workspace.name',
      'workspace.description',
      'workspace.logoURL',
      'workspace.bannerURL',
      'workspace.createdBy',
      'workspace.createdAt',
      'workspace.updatedAt',
    ]);

    const page = paginationOptions.page || 1;
    const limit = paginationOptions.limit || 10;

    queryBuilder.skip((page - 1) * limit).take(limit);

    if (paginationOptions.sort) {
      const sortOrder = paginationOptions.sort.startsWith('-') ? 'DESC' : 'ASC';
      const sortField = paginationOptions.sort.replace('-', '');
      queryBuilder.orderBy(`workspaceMember.${sortField}`, sortOrder);
    }

    const [docs, totalDocs] = await queryBuilder.getManyAndCount();

    return {
      docs,
      totalDocs,
      limit,
      page,
      totalPages: Math.ceil(totalDocs / limit),
      hasNextPage: page < Math.ceil(totalDocs / limit),
      hasPrevPage: page > 1,
      nextPage: page < Math.ceil(totalDocs / limit) ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    };
  }

  async findByUserEmail(
    userEmail: string,
    pagination?: PaginationDto,
  ): Promise<any> {
    if (!pagination) {
      pagination = { page: 1, limit: 10, sortBy: '-createdAt' };
    }

    const { search, paginationOptions } = extractPaginationOptions(pagination);

    const where: any = {
      primaryEmail: userEmail,
      status: MemberStatus.ACTIVE,
    };

    const queryBuilder =
      this.workspaceMemberRepository.createQueryBuilder('workspaceMember');

    queryBuilder.where(where);

    if (search) {
      queryBuilder.andWhere(
        '(workspaceMember.firstName ILIKE :search OR workspaceMember.lastName ILIKE :search OR workspaceMember.primaryEmail ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder.leftJoinAndSelect('workspaceMember.workspace', 'workspace');
    queryBuilder.select([
      'workspaceMember',
      'workspace.id',
      'workspace.name',
      'workspace.description',
      'workspace.logoURL',
      'workspace.bannerURL',
      'workspace.createdBy',
      'workspace.createdAt',
      'workspace.updatedAt',
    ]);

    const page = paginationOptions.page || 1;
    const limit = paginationOptions.limit || 10;

    queryBuilder.skip((page - 1) * limit).take(limit);

    if (paginationOptions.sort) {
      const sortOrder = paginationOptions.sort.startsWith('-') ? 'DESC' : 'ASC';
      const sortField = paginationOptions.sort.replace('-', '');
      queryBuilder.orderBy(`workspaceMember.${sortField}`, sortOrder);
    }

    const [docs, totalDocs] = await queryBuilder.getManyAndCount();

    return {
      docs,
      totalDocs,
      limit,
      page,
      totalPages: Math.ceil(totalDocs / limit),
      hasNextPage: page < Math.ceil(totalDocs / limit),
      hasPrevPage: page > 1,
      nextPage: page < Math.ceil(totalDocs / limit) ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    };
  }

  async findByInvitedBy(
    invitedByUserId: string,
    pagination?: PaginationDto,
  ): Promise<any> {
    if (!pagination) {
      pagination = { page: 1, limit: 10, sortBy: '-createdAt' };
    }

    const { search, paginationOptions } = extractPaginationOptions(pagination);

    const where: any = {
      invitedBy: invitedByUserId,
      status: MemberStatus.ACTIVE,
    };

    const queryBuilder =
      this.workspaceMemberRepository.createQueryBuilder('workspaceMember');

    queryBuilder.where(where);

    if (search) {
      queryBuilder.andWhere(
        '(workspaceMember.firstName ILIKE :search OR workspaceMember.lastName ILIKE :search OR workspaceMember.primaryEmail ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder.leftJoinAndSelect('workspaceMember.workspace', 'workspace');
    queryBuilder.leftJoinAndSelect('workspaceMember.user', 'user');
    queryBuilder.select([
      'workspaceMember',
      'workspace.id',
      'workspace.name',
      'workspace.description',
      'workspace.logoURL',
      'workspace.bannerURL',
      'workspace.createdBy',
      'workspace.createdAt',
      'workspace.updatedAt',
      'user.id',
      'user.email',
      'user.timezone',
      'user.isEmailVerified',
    ]);

    const page = paginationOptions.page || 1;
    const limit = paginationOptions.limit || 10;

    queryBuilder.skip((page - 1) * limit).take(limit);

    if (paginationOptions.sort) {
      const sortOrder = paginationOptions.sort.startsWith('-') ? 'DESC' : 'ASC';
      const sortField = paginationOptions.sort.replace('-', '');
      queryBuilder.orderBy(`workspaceMember.${sortField}`, sortOrder);
    }

    const [docs, totalDocs] = await queryBuilder.getManyAndCount();

    return {
      docs,
      totalDocs,
      limit,
      page,
      totalPages: Math.ceil(totalDocs / limit),
      hasNextPage: page < Math.ceil(totalDocs / limit),
      hasPrevPage: page > 1,
      nextPage: page < Math.ceil(totalDocs / limit) ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    };
  }

  private generateTemporaryPassword(): string {
    // Generate a random 8-character password with uppercase, lowercase, and numbers
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  async inviteMember(
    inviteMemberDto: InviteMemberDto,
    workspaceId: string,
    invitingMember: WorkspaceMember,
  ): Promise<WorkspaceMember> {
    const existingMember = await this.workspaceMemberRepository.findOne({
      where: {
        primaryEmail: inviteMemberDto.primaryEmail,
        workspaceId,
      },
    });

    if (existingMember) {
      throw new ConflictException(
        'A member with this email already exists in the workspace',
      );
    }

    // Generate temporary password
    const tempPassword = this.generateTemporaryPassword();

    // Check if user already exists, if not create one
    let user = await this.userRepository.findOne({
      where: { email: inviteMemberDto.primaryEmail },
    });

    if (!user) {
      // Create new user
      user = this.userRepository.create({
        email: inviteMemberDto.primaryEmail,
        timezone: 'UTC',
        isEmailVerified: false,
      });
      user = await this.userRepository.save(user);

      // Create user secrets with temporary password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(tempPassword, salt);

      const userSecrets = this.userSecretsRepository.create({
        userId: user.id,
        passwordHash,
        passwordSalt: salt,
      });
      await this.userSecretsRepository.save(userSecrets);
    } else {
      // Update existing user's password with temporary password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(tempPassword, salt);

      await this.userSecretsRepository.update(
        { userId: user.id },
        { passwordHash, passwordSalt: salt }
      );
    }

    // Create workspace member
    const workspaceMember = this.workspaceMemberRepository.create({
      userId: user.id,
      workspaceId,
      firstName: inviteMemberDto.firstName,
      lastName: inviteMemberDto.lastName,
      middleName: inviteMemberDto.middleName || null,
      primaryEmail: inviteMemberDto.primaryEmail,
      status: MemberStatus.ACTIVE, // Set to active since we're providing login details
      workPhone: inviteMemberDto.workPhone || null,
      primaryRoleId: inviteMemberDto.primaryRole || null,
      primaryTeamId: inviteMemberDto.primaryTeam || null,
      invitedById: invitingMember.userId,
      avatarURL: { sm: '', original: '' },
    });

    const savedWorkspaceMember = await this.workspaceMemberRepository.save(workspaceMember);

    // Create workspace member secrets with the same password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(tempPassword, salt);

    const memberSecrets = this.workspaceMemberSecretsRepository.create({
      workspaceMemberId: savedWorkspaceMember.id,
      passwordHash,
      passwordSalt: salt,
      passwordChangedAt: new Date(),
    });
    await this.workspaceMemberSecretsRepository.save(memberSecrets);

    // Get workspace info for email
    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId },
    });

    try {
      // Send login details email instead of invitation
      const loginUrl = `${APP_CONFIG.app_url}/login`;
      
      await useCTAMail({
        to: inviteMemberDto.primaryEmail,
        heading: `Welcome to ${workspace?.name || 'TensilLabs'}!`,
        body: `Hi ${inviteMemberDto.firstName},\n\nYou have been added to ${workspace?.name || 'the workspace'}. Here are your login details:\n\nEmail: ${inviteMemberDto.primaryEmail}\nTemporary Password: ${tempPassword}\n\nPlease log in and change your password as soon as possible.`,
        ctaText: 'Login to Workspace',
        ctaUrl: loginUrl,
        firstName: inviteMemberDto.firstName,
        lastName: inviteMemberDto.lastName,
      });
    } catch (error) {
      console.error('Failed to send login details email:', error);
    }

    return savedWorkspaceMember;
  }

  async acceptInvitation(
    memberId: string,
    userId: string,
  ): Promise<WorkspaceMember> {
    const member = await this.workspaceMemberRepository.findOne({
      where: { id: memberId },
    });

    if (!member) {
      throw new BadRequestException('Invitation not found');
    }

    if (member.status !== MemberStatus.PENDING) {
      throw new BadRequestException('Invitation is not pending');
    }

    if (member.userId && member.userId !== userId) {
      throw new BadRequestException('Invalid user for this invitation');
    }

    member.status = MemberStatus.ACTIVE;
    member.lastActiveAt = new Date();

    if (!member.userId) {
      member.userId = userId;
    }

    return await this.workspaceMemberRepository.save(member);
  }
}
