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
import { Employee } from '../../employees/employee.schema';

export enum TimeOffType {
  PERSONAL = 'personal',
  FAMILY_EMERGENCY = 'family_emergency',
  MEDICAL_APPOINTMENT = 'medical_appointment',
  BEREAVEMENT = 'bereavement',
  RELIGIOUS_OBSERVANCE = 'religious_observance',
  JURY_DUTY = 'jury_duty',
  MILITARY_LEAVE = 'military_leave',
  OTHER = 'other',
}

export enum TimeOffStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('time_off_requests')
@Index(['employeeId', 'workspaceId', 'startDate'])
@Index(['memberId', 'workspaceId'])
export class TimeOffRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  employeeId: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

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
    enum: TimeOffType,
  })
  type: TimeOffType;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  reason?: string;

  @Column({ type: 'uuid', nullable: true })
  coverById?: string;

  @ManyToOne(() => WorkspaceMember, { nullable: true })
  @JoinColumn({ name: 'coverById' })
  coverBy?: WorkspaceMember;

  @Column({
    type: 'enum',
    enum: TimeOffStatus,
    default: TimeOffStatus.PENDING,
  })
  status: TimeOffStatus;

  @Column({ type: 'uuid', nullable: true })
  approvedById?: string;

  @ManyToOne(() => WorkspaceMember, { nullable: true })
  @JoinColumn({ name: 'approvedById' })
  approvedBy?: WorkspaceMember;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt?: Date;

  @Column({ type: 'uuid', nullable: true })
  rejectedById?: string;

  @ManyToOne(() => WorkspaceMember, { nullable: true })
  @JoinColumn({ name: 'rejectedById' })
  rejectedBy?: WorkspaceMember;

  @Column({ type: 'timestamp', nullable: true })
  rejectedAt?: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
