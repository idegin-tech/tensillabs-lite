import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/schemas/user.schema';
import { Workspace } from '../../workspaces/schemas/workspace.schema';

export enum MemberStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
}

@Entity('workspace_members')
@Index(['userId', 'workspaceId'], { unique: true })
@Index(['workspaceId'])
@Index(['userId'])
@Index(['status'])
@Index(['primaryEmail'])
export class WorkspaceMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  workspaceId: string;

  @ManyToOne(() => Workspace)
  @JoinColumn({ name: 'workspaceId' })
  workspace: Workspace;

  @Column({
    type: 'jsonb',
    default: { sm: '', original: '' },
  })
  avatarURL: {
    sm: string;
    original: string;
  };

  @Column({ type: 'varchar', length: 50 })
  firstName: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  middleName: string;

  @Column({ type: 'varchar', length: 50 })
  lastName: string;

  @Column({ type: 'varchar', length: 255 })
  primaryEmail: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  secondaryEmail: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  bio: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  workPhone: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  mobilePhone: string;

  @Column({
    type: 'enum',
    enum: MemberStatus,
    default: MemberStatus.ACTIVE,
  })
  status: MemberStatus;

  @Column({ type: 'uuid', nullable: true })
  primaryRoleId: string;

  @Column({ type: 'uuid', nullable: true })
  primaryTeamId: string;

  @Column({ type: 'timestamp', nullable: true })
  lastActiveAt: Date;

  @Column({ type: 'uuid', nullable: true })
  invitedById: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'invitedById' })
  invitedBy: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
