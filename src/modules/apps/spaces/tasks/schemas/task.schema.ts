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
import { List } from '../../lists/schemas/list.schema';

export enum TaskPriority {
  URGENT = 'urgent',
  HIGH = 'high',
  NORMAL = 'normal',
  LOW = 'low',
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  IN_REVIEW = 'in_review',
  CANCELED = 'canceled',
  COMPLETED = 'completed',
}

@Entity('tasks')
@Index(['listId'])
@Index(['spaceId'])
@Index(['workspaceId'])
@Index(['createdById'])
@Index(['status'])
@Index(['priority'])
@Index(['isDeleted'])
@Index(['task_id'])
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  task_id: string;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    nullable: true,
  })
  priority: TaskPriority;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  timeframe: {
    start?: Date;
    end?: Date;
  };

  @Column({ type: 'text', array: true, nullable: true, default: '{}' })
  assigneeIds: string[];

  @Column({ type: 'float', nullable: true })
  estimatedHours: number;

  @Column({ type: 'float', nullable: true })
  actualHours: number;

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  statusChangedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  dueDate: Date;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  blockedReason: {
    reason?: string;
    description?: string;
    blockedAt?: Date;
  };

  @Column({ type: 'text', array: true, nullable: true, default: '{}' })
  blockedByTaskIds: string[];

  @Column({ type: 'text', array: true, nullable: true, default: '{}' })
  tags: string[];

  @Column({ type: 'float', default: 0 })
  progress: number;

  @Column({ type: 'uuid' })
  createdById: string;

  @ManyToOne(() => WorkspaceMember)
  @JoinColumn({ name: 'createdById' })
  createdBy: WorkspaceMember;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

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

  @Column({ type: 'uuid' })
  listId: string;

  @ManyToOne(() => List)
  @JoinColumn({ name: 'listId' })
  list: List;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
