import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { WorkspaceMember } from '../../workspace-members/schemas/workspace-member.schema';
import { Workspace } from '../../workspaces/schemas/workspace.schema';
import { File } from '../../files/schemas/file.schema';

@Entity('comments')
@Index(['workspaceId'])
@Index(['taskId'])
@Index(['createdById'])
@Index(['parentCommentId'])
@Index(['isDeleted'])
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'uuid' })
  createdById: string;

  @ManyToOne(() => WorkspaceMember)
  @JoinColumn({ name: 'createdById' })
  createdBy: WorkspaceMember;

  @Column({ type: 'uuid' })
  workspaceId: string;

  @ManyToOne(() => Workspace)
  @JoinColumn({ name: 'workspaceId' })
  workspace: Workspace;

  @Column({ type: 'uuid', nullable: true })
  taskId: string;

  @Column({ type: 'uuid', nullable: true })
  parentCommentId: string;

  @ManyToOne(() => Comment, { nullable: true })
  @JoinColumn({ name: 'parentCommentId' })
  parentComment: Comment;

  @OneToMany(() => File, (file) => file.comment)
  files: File[];

  @Column({ type: 'jsonb', nullable: true, default: '[]' })
  reactions: Array<{
    emoji: string;
    memberIds: string[];
  }>;

  @Column({ type: 'uuid', nullable: true })
  listId: string;

  @Column({ type: 'uuid', nullable: true })
  spaceId: string;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
