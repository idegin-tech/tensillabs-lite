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
import { User } from '../../users/schemas/user.schema';

@Entity('workspaces')
@Index(['createdById'])
@Index(['name'])
@Index(['createdAt'])
@Index(['slug'], { unique: true })
export class Workspace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

  @Column({ type: 'uuid' })
  createdById: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column({ type: 'varchar', length: 500, nullable: true })
  logoURL: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  bannerURL: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  slug: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
