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

@Entity('attendances')
@Index(['memberId', 'officeId', 'clockIn'])
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  memberId: string;

  @ManyToOne(() => WorkspaceMember)
  @JoinColumn({ name: 'memberId' })
  member: WorkspaceMember;

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
