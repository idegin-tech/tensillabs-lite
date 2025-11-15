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
import { Office } from '../../../../options/offices/schemas/office.schema';
import { Workspace } from '../../../../workspaces/schemas/workspace.schema';

@Entity('attendances')
@Index(['memberId', 'officeId', 'clockIn'])
@Index(['workspaceId'])
export class Attendance {
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

  @Column({ type: 'uuid', nullable: true })
  officeId?: string;

  @ManyToOne(() => Office, { nullable: true })
  @JoinColumn({ name: 'officeId' })
  office?: Office;

  @Column({ type: 'timestamp' })
  clockIn: Date;

  @Column({ type: 'timestamp', nullable: true })
  clockOut?: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  remarks?: string;

  @Column({ type: 'float', nullable: true })
  totalHours?: number;

  @Column({ type: 'boolean', default: false })
  isLate: boolean;

  @Column({ type: 'boolean', default: false })
  isEarlyLeave: boolean;

  @Column({
    type: 'enum',
    enum: ['open', 'closed'],
    default: 'open',
  })
  status: 'open' | 'closed';

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
