import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { Workspace } from '../../../workspaces/schemas/workspace.schema';
import { WorkspaceMember } from '../../../workspace-members/schemas/workspace-member.schema';
import { Project } from '../../../projects/schemas/project.schema';
import { Task } from '../../spaces/tasks/schemas/task.schema';

@Entity('time_entries')
@Index(['workspaceId'])
@Index(['projectId'])
@Index(['taskId'])
@Index(['createdById'])
@Index(['parentEntryId'])
@Index(['isDeleted'])
@Index(['startTime'])
@Index(['endTime'])
export class TimeEntry {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    description: string;

    @Column({ type: 'timestamp' })
    startTime: Date;

    @Column({ type: 'timestamp', nullable: true })
    endTime: Date;

    @Column({ type: 'int', nullable: true })
    durationMinutes: number;

    @Column({ type: 'uuid' })
    workspaceId: string;

    @ManyToOne(() => Workspace)
    @JoinColumn({ name: 'workspaceId' })
    workspace: Workspace;

    @Column({ type: 'uuid', nullable: true })
    projectId: string;

    @ManyToOne(() => Project, { nullable: true })
    @JoinColumn({ name: 'projectId' })
    project: Project;

    @Column({ type: 'uuid', nullable: true })
    taskId: string;

    @ManyToOne(() => Task, { nullable: true })
    @JoinColumn({ name: 'taskId' })
    task: Task;

    @Column({ type: 'uuid' })
    createdById: string;

    @ManyToOne(() => WorkspaceMember)
    @JoinColumn({ name: 'createdById' })
    createdBy: WorkspaceMember;

    @Column({ type: 'uuid', nullable: true })
    updatedById: string;

    @ManyToOne(() => WorkspaceMember, { nullable: true })
    @JoinColumn({ name: 'updatedById' })
    updatedBy: WorkspaceMember;

    @Column({ type: 'uuid', nullable: true })
    parentEntryId: string;

    @ManyToOne(() => TimeEntry, (entry) => entry.subEntries, { nullable: true })
    @JoinColumn({ name: 'parentEntryId' })
    parentEntry: TimeEntry;

    @OneToMany(() => TimeEntry, (entry) => entry.parentEntry)
    subEntries: TimeEntry[];

    @Column({ type: 'boolean', default: false })
    isDeleted: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
