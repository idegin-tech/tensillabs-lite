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
import { Workspace } from '../../../../workspaces/schemas/workspace.schema';
import { Space } from '../../schemas/space.schema';

@Entity('lists')
@Index(['spaceId'])
@Index(['workspaceId'])
@Index(['isDeleted'])
@Index(['isPrivate'])
export class List {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description?: string;

  @Column({ type: 'boolean', default: false })
  isPrivate: boolean;

  @Column({ type: 'uuid' })
  workspaceId: string;

  @ManyToOne(() => Workspace)
  @JoinColumn({ name: 'workspaceId' })
  workspace: Workspace;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ type: 'uuid' })
  spaceId: string;

  @ManyToOne(() => Space)
  @JoinColumn({ name: 'spaceId' })
  space: Space;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
