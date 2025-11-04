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
import { Task } from '../../apps/spaces/tasks/schemas/task.schema';
import { Workspace } from '../../workspaces/schemas/workspace.schema';
import { Space } from '../../apps/spaces/schemas/space.schema';
import { List } from '../../apps/spaces/lists/schemas/list.schema';
import { WorkspaceMember } from '../../workspace-members/schemas/workspace-member.schema';

@Entity('checklists')
@Index(['taskId'])
@Index(['workspaceId'])
@Index(['spaceId'])
@Index(['listId'])
@Index(['createdById'])
@Index(['isDeleted'])
@Index(['isDone'])
export class Checklist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'boolean', default: false })
  isDone: boolean;

  @Column({ type: 'uuid', nullable: true })
  taskId: string;

  @ManyToOne(() => Task, { nullable: true })
  @JoinColumn({ name: 'taskId' })
  task: Task;

  @Column({ type: 'uuid' })
  workspaceId: string;

  @ManyToOne(() => Workspace)
  @JoinColumn({ name: 'workspaceId' })
  workspace: Workspace;

  @Column({ type: 'uuid', nullable: true })
  spaceId: string;

  @ManyToOne(() => Space, { nullable: true })
  @JoinColumn({ name: 'spaceId' })
  space: Space;

  @Column({ type: 'uuid', nullable: true })
  listId: string;

  @ManyToOne(() => List, { nullable: true })
  @JoinColumn({ name: 'listId' })
  list: List;

  @Column({ type: 'uuid' })
  createdById: string;

  @ManyToOne(() => WorkspaceMember)
  @JoinColumn({ name: 'createdById' })
  createdBy: WorkspaceMember;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
