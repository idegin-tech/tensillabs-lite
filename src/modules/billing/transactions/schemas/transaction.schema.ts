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
import { Wallet } from '../../wallets/schemas/wallet.schema';

@Entity('transactions')
@Index(['workspaceId'])
@Index(['walletId'])
@Index(['paid'])
@Index(['paidOn'])
@Index(['dueDate'])
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  workspaceId: string;

  @ManyToOne(() => Workspace)
  @JoinColumn({ name: 'workspaceId' })
  workspace: Workspace;

  @Column({ type: 'uuid' })
  walletId: string;

  @ManyToOne(() => Wallet)
  @JoinColumn({ name: 'walletId' })
  wallet: Wallet;

  @Column({ type: 'boolean', default: false })
  paid: boolean;

  @Column({ type: 'int' })
  numberOfMembers: number;

  @Column({ type: 'timestamp', nullable: true })
  paidOn: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discountPercentage: number;

  @Column({ type: 'timestamp' })
  dueDate: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
