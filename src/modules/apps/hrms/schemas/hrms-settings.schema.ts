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

@Entity('hrms_settings')
@Index(['workspaceId'], { unique: true })
export class HrmsSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  workspaceId: string;

  @ManyToOne(() => Workspace)
  @JoinColumn({ name: 'workspaceId' })
  workspace: Workspace;

  @Column({ type: 'time', default: '09:00' })
  organizationOpenTime: string;

  @Column({ type: 'time', default: '17:00' })
  organizationCloseTime: string;

  @Column({ type: 'float', default: 8 })
  workHoursPerDay: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
