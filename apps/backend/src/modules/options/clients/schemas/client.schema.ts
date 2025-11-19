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
import { Workspace } from '../../../workspaces/schemas/workspace.schema';
import { WorkspaceMember } from '../../../workspace-members/schemas/workspace-member.schema';

@Entity('clients')
@Index(['workspaceId'])
@Index(['name'])
@Index(['isActive'])
@Index(['isDeleted'])
@Index(['createdById'])
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'uuid' })
  workspaceId: string;

  @ManyToOne(() => Workspace)
  @JoinColumn({ name: 'workspaceId' })
  workspace: Workspace;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ type: 'uuid' })
  createdById: string;

  @ManyToOne(() => WorkspaceMember)
  @JoinColumn({ name: 'createdById' })
  createdBy: WorkspaceMember;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

  @Column({ type: 'simple-array', default: '' })
  officeIds: string[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
