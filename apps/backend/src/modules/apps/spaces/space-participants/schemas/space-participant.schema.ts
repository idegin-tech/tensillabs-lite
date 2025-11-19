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
import { WorkspaceMember } from '../../../../workspace-members/schemas/workspace-member.schema';
import { Workspace } from '../../../../workspaces/schemas/workspace.schema';
import { Space } from '../../schemas/space.schema';

export enum SpacePermission {
  ADMIN = 'admin',
  REGULAR = 'regular',
}

export enum ParticipantStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('space_participants')
@Index(['spaceId'])
@Index(['memberId'])
@Index(['workspaceId'])
@Index(['status'])
@Index(['memberId', 'spaceId'], { unique: true })
export class SpaceParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  memberId: string;

  @ManyToOne(() => WorkspaceMember)
  @JoinColumn({ name: 'memberId' })
  member: WorkspaceMember;

  @Column({ type: 'uuid' })
  workspaceId: string;

  @ManyToOne(() => Workspace)
  @JoinColumn({ name: 'workspaceId' })
  workspace: Workspace;

  @Column({ type: 'uuid' })
  spaceId: string;

  @ManyToOne(() => Space)
  @JoinColumn({ name: 'spaceId' })
  space: Space;

  @Column({
    type: 'enum',
    enum: SpacePermission,
    default: SpacePermission.REGULAR,
  })
  permissions: SpacePermission;

  @Column({
    type: 'enum',
    enum: ParticipantStatus,
    default: ParticipantStatus.ACTIVE,
  })
  status: ParticipantStatus;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
