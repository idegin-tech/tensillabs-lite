import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { WorkspaceMember } from './workspace-member.schema';

@Entity('workspace_member_secrets')
@Index(['workspaceMemberId'], { unique: true })
export class WorkspaceMemberSecrets {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  workspaceMemberId: string;

  @OneToOne(() => WorkspaceMember, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspaceMemberId' })
  workspaceMember: WorkspaceMember;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'varchar', length: 255 })
  passwordSalt: string;

  @Column({ type: 'varchar', length: 6, nullable: true })
  otpCode: string;

  @Column({ type: 'timestamp', nullable: true })
  otpExpiresAt: Date;

  @Column({ type: 'int', default: 0 })
  otpAttempts: number;

  @Column({ type: 'timestamp', nullable: true })
  otpLockedUntil: Date;

  @Column({ type: 'timestamp', nullable: true })
  passwordChangedAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}