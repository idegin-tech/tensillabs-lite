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
import { WorkspaceMember } from '../../workspace-members/schemas/workspace-member.schema';
import { Workspace } from '../../workspaces/schemas/workspace.schema';

@Entity('files')
@Index(['workspaceId'])
@Index(['createdById'])
@Index(['taskId'])
@Index(['spaceId'])
@Index(['isDeleted'])
@Index(['isActive'])
@Index(['createdAt'])
@Index(['size'])
@Index(['mimeType'])
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  thumbnailURL: string;

  @Column({ type: 'uuid' })
  createdById: string;

  @ManyToOne(() => WorkspaceMember)
  @JoinColumn({ name: 'createdById' })
  createdBy: WorkspaceMember;

  @Column({ type: 'uuid' })
  workspaceId: string;

  @ManyToOne(() => Workspace)
  @JoinColumn({ name: 'workspaceId' })
  workspace: Workspace;

  @Column({ type: 'uuid', nullable: true })
  taskId: string;

  @Column({ type: 'uuid', nullable: true })
  spaceId: string;

  @Column({ type: 'bigint', default: 0 })
  size: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  mimeType: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  fileURL: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fileKey: string;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
