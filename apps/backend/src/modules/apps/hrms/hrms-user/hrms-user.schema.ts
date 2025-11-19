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
import { WorkspaceMember } from '../../../workspace-members/schemas/workspace-member.schema';
import { Workspace } from '../../../workspaces/schemas/workspace.schema';

export enum HrmsUserPermission {
  ADMIN = 'admin',
  MANAGER = 'manager',
}

@Entity('hrms_users')
@Index(['memberId', 'workspaceId'], { unique: true })
export class HrmsUser {
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

  @Column({
    type: 'enum',
    enum: HrmsUserPermission,
    default: HrmsUserPermission.MANAGER,
  })
  permission: HrmsUserPermission;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

