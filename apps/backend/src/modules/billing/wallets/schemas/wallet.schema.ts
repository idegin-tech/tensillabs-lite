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

export enum Currency {
  USD = 'USD',
  NGN = 'NGN',
}

@Entity('wallets')
@Index(['workspaceId'])
@Index(['currency'])
@Index(['nextBillingDate'])
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  workspaceId: string;

  @ManyToOne(() => Workspace)
  @JoinColumn({ name: 'workspaceId' })
  workspace: Workspace;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  currentBalance: number;

  @Column({
    type: 'enum',
    enum: Currency,
  })
  currency: Currency;

  @Column({ type: 'timestamp' })
  nextBillingDate: Date;

  @Column({ type: 'int', default: 0 })
  tier: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
