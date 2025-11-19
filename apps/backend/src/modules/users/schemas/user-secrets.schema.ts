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
import { User } from './user.schema';

@Entity('user_secrets')
@Index(['userId'], { unique: true })
@Index(['passwordResetToken'])
@Index(['lockedUntil'])
export class UserSecrets {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 255, select: false })
  passwordHash: string;

  @Column({ type: 'varchar', length: 255, nullable: true, select: false })
  passwordSalt: string;

  @Column({ type: 'timestamp', nullable: true })
  passwordChangedAt: Date;

  @Column({ type: 'varchar', length: 255, nullable: true, select: false })
  otpSecret: string;

  @Column({ type: 'boolean', default: false })
  otpEnabled: boolean;

  @Column({ type: 'simple-array', default: '', select: false })
  otpBackupCodes: string[];

  @Column({ type: 'timestamp', nullable: true })
  otpExpiresAt: Date;

  @Column({ type: 'varchar', length: 255, nullable: true, select: false })
  passwordResetToken: string;

  @Column({ type: 'int', default: 0 })
  failedLoginAttempts: number;

  @Column({ type: 'timestamp', nullable: true })
  lockedUntil: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
