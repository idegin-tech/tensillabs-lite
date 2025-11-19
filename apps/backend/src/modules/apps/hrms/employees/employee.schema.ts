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

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum MaritalStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed',
  SEPARATED = 'separated',
}

export enum EmploymentType {
  PERMANENT = 'permanent',
  CONTRACT = 'contract',
  INTERN = 'intern',
  TEMPORARY = 'temporary',
  PART_TIME = 'part_time',
  CONSULTANT = 'consultant',
}

export enum Religion {
  CHRISTIANITY = 'christianity',
  ISLAM = 'islam',
  TRADITIONAL = 'traditional',
  OTHER = 'other',
  NONE = 'none',
}

interface EmergencyContact {
  name: string;
  phone: string;
  address?: string;
  relationship: string;
  email?: string;
  notes?: string;
}

@Entity('employees')
@Index(['memberId', 'workspaceId'], { unique: true })
@Index(['employeeId'], { unique: true })
export class Employee {
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

  @Column({ type: 'varchar', length: 50 })
  firstName: string;

  @Column({ type: 'varchar', length: 50 })
  lastName: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  middleName: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  address: string;

  @Column({ type: 'jsonb', default: [] })
  emergencyContacts: EmergencyContact[];

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
    default: Gender.OTHER,
  })
  gender: Gender;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nationality: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  stateOfOrigin: string;

  @Column({
    type: 'enum',
    enum: MaritalStatus,
    nullable: true,
  })
  maritalStatus: MaritalStatus;

  @Column({
    type: 'enum',
    enum: Religion,
    nullable: true,
  })
  religion: Religion;

  @Column({ type: 'varchar', length: 20, nullable: true })
  nin: string;

  @Column({
    type: 'enum',
    enum: EmploymentType,
    nullable: true,
    default: EmploymentType.PERMANENT,
  })
  employmentType: EmploymentType;

  @Column({ type: 'varchar', length: 50, nullable: true, unique: true })
  employeeId: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
