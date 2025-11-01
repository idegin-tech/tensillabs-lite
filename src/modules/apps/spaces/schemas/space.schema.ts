import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { WorkspaceMember } from '../../../workspace-members/schemas/workspace-member.schema';
import { Workspace } from '../../../workspaces/schemas/workspace.schema';
import { List } from '../lists/schemas/list.schema';

@Entity('spaces')
@Index(['workspaceId'])
@Index(['createdById'])
@Index(['isDeleted'])
@Index(['isPublic'])
export class Space {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 20, default: '#3B82F6' })
  color: string;

  @Column({ type: 'varchar', length: 50, default: 'fa-folder' })
  icon: string;

  @Column({ type: 'uuid' })
  createdById: string;

  @ManyToOne(() => WorkspaceMember)
  @JoinColumn({ name: 'createdById' })
  createdBy: WorkspaceMember;

  @Column({ type: 'boolean', default: false })
  isPublic: boolean;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ type: 'uuid' })
  workspaceId: string;

  @ManyToOne(() => Workspace)
  @JoinColumn({ name: 'workspaceId' })
  workspace: Workspace;

  @OneToMany(() => List, (list) => list.space)
  lists: List[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
