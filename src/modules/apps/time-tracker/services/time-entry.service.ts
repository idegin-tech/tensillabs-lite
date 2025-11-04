import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeEntry } from '../schemas/time-entry.schema';
import {
    CreateTimeEntryDto,
    ResumeTimeEntryDto,
    UpdateTimeEntryDto,
    DeleteTimeEntriesDto,
    GetTimeEntriesQueryDto,
} from '../dto/time-entry.dto';

@Injectable()
export class TimeEntryService {
    constructor(
        @InjectRepository(TimeEntry)
        private timeEntryRepository: Repository<TimeEntry>,
    ) { }

    async createTimeEntry(
        createTimeEntryDto: CreateTimeEntryDto,
        workspaceId: string,
        memberId: string,
    ): Promise<TimeEntry> {
        const timeEntry = this.timeEntryRepository.create({
            description: createTimeEntryDto.description,
            startTime: new Date(createTimeEntryDto.startTime),
            workspaceId,
            projectId: createTimeEntryDto.projectId,
            taskId: createTimeEntryDto.taskId,
            createdById: memberId,
        });

        return await this.timeEntryRepository.save(timeEntry);
    }

    async resumeTimeEntry(
        parentEntryId: string,
        resumeTimeEntryDto: ResumeTimeEntryDto,
        workspaceId: string,
        memberId: string,
    ): Promise<TimeEntry> {
        const parentEntry = await this.timeEntryRepository.findOne({
            where: {
                id: parentEntryId,
                workspaceId,
                createdById: memberId,
                isDeleted: false,
            },
        });

        if (!parentEntry) {
            throw new NotFoundException('Parent time entry not found');
        }

        if (parentEntry.parentEntryId) {
            throw new BadRequestException('Cannot resume a sub-entry');
        }

        if (!parentEntry.endTime) {
            throw new BadRequestException(
                'Cannot resume an entry that is still running',
            );
        }

        const subEntry = this.timeEntryRepository.create({
            description: resumeTimeEntryDto.description || parentEntry.description,
            startTime: new Date(resumeTimeEntryDto.startTime),
            workspaceId,
            projectId: parentEntry.projectId,
            taskId: parentEntry.taskId,
            createdById: memberId,
            parentEntryId: parentEntry.id,
        });

        return await this.timeEntryRepository.save(subEntry);
    }

    async getTimeEntries(
        workspaceId: string,
        memberId: string,
        queryParams: GetTimeEntriesQueryDto,
    ): Promise<{ entries: TimeEntry[]; totalCount: number; hasMore: boolean }> {
        const page = queryParams.page || 1;
        const limit = queryParams.limit || 20;
        const skip = (page - 1) * limit;

        const queryBuilder = this.timeEntryRepository
            .createQueryBuilder('timeEntry')
            .leftJoinAndSelect('timeEntry.project', 'project')
            .leftJoinAndSelect('timeEntry.task', 'task')
            .leftJoinAndSelect('timeEntry.createdBy', 'createdBy')
            .leftJoinAndSelect('timeEntry.updatedBy', 'updatedBy')
            .leftJoinAndSelect('timeEntry.subEntries', 'subEntries')
            .where('timeEntry.workspaceId = :workspaceId', { workspaceId })
            .andWhere('timeEntry.createdById = :memberId', { memberId });

        if (!queryParams.includeDeleted) {
            queryBuilder.andWhere('timeEntry.isDeleted = :isDeleted', {
                isDeleted: false,
            });
        }

        if (queryParams.parentOnly) {
            queryBuilder.andWhere('timeEntry.parentEntryId IS NULL');
        }

        if (queryParams.projectId) {
            queryBuilder.andWhere('timeEntry.projectId = :projectId', {
                projectId: queryParams.projectId,
            });
        }

        if (queryParams.taskId) {
            queryBuilder.andWhere('timeEntry.taskId = :taskId', {
                taskId: queryParams.taskId,
            });
        }

        if (queryParams.startDate) {
            queryBuilder.andWhere('timeEntry.startTime >= :startDate', {
                startDate: new Date(queryParams.startDate),
            });
        }

        if (queryParams.endDate) {
            queryBuilder.andWhere('timeEntry.startTime <= :endDate', {
                endDate: new Date(queryParams.endDate),
            });
        }

        queryBuilder.orderBy('timeEntry.startTime', 'DESC');

        const totalCount = await queryBuilder.getCount();

        const entries = await queryBuilder.skip(skip).take(limit).getMany();

        const hasMore = skip + entries.length < totalCount;

        return { entries, totalCount, hasMore };
    }

    async bulkUpdateTimeEntries(
        updateTimeEntryDto: UpdateTimeEntryDto,
        workspaceId: string,
        memberId: string,
    ): Promise<TimeEntry[]> {
        const updatedEntries: TimeEntry[] = [];

        for (const entry of updateTimeEntryDto.entries) {
            const timeEntry = await this.timeEntryRepository.findOne({
                where: {
                    id: entry.id,
                    workspaceId,
                    createdById: memberId,
                    isDeleted: false,
                },
            });

            if (!timeEntry) {
                throw new NotFoundException(`Time entry ${entry.id} not found`);
            }

            if (entry.description !== undefined) {
                timeEntry.description = entry.description;
            }

            if (entry.startTime) {
                timeEntry.startTime = new Date(entry.startTime);
            }

            if (entry.endTime !== undefined) {
                timeEntry.endTime = entry.endTime ? new Date(entry.endTime) : null;
            }

            if (entry.projectId !== undefined) {
                timeEntry.projectId = entry.projectId;
            }

            if (entry.taskId !== undefined) {
                timeEntry.taskId = entry.taskId;
            }

            if (timeEntry.startTime && timeEntry.endTime) {
                const duration = Math.floor(
                    (timeEntry.endTime.getTime() - timeEntry.startTime.getTime()) /
                    (1000 * 60),
                );
                timeEntry.durationMinutes = duration;
            }

            timeEntry.updatedById = memberId;

            const updated = await this.timeEntryRepository.save(timeEntry);
            updatedEntries.push(updated);
        }

        return updatedEntries;
    }

    async bulkDeleteTimeEntries(
        deleteTimeEntriesDto: DeleteTimeEntriesDto,
        workspaceId: string,
        memberId: string,
    ): Promise<{ deletedCount: number }> {
        const idsToDelete = deleteTimeEntriesDto.ids;

        const entries = await this.timeEntryRepository.find({
            where: idsToDelete.map((id) => ({
                id,
                workspaceId,
                createdById: memberId,
                isDeleted: false,
            })),
        });

        if (entries.length === 0) {
            throw new NotFoundException('No time entries found to delete');
        }

        const mainEntryIds = entries
            .filter((entry) => !entry.parentEntryId)
            .map((entry) => entry.id);

        const entriesToDelete = await this.timeEntryRepository.find({
            where: [
                ...idsToDelete.map((id) => ({
                    id,
                    workspaceId,
                    createdById: memberId,
                })),
                ...mainEntryIds.map((parentId) => ({
                    parentEntryId: parentId,
                    workspaceId,
                    createdById: memberId,
                })),
            ],
        });

        for (const entry of entriesToDelete) {
            entry.isDeleted = true;
            entry.updatedById = memberId;
        }

        await this.timeEntryRepository.save(entriesToDelete);

        return { deletedCount: entriesToDelete.length };
    }

    async getTimeEntryById(
        entryId: string,
        workspaceId: string,
        memberId: string,
    ): Promise<TimeEntry> {
        const entry = await this.timeEntryRepository.findOne({
            where: {
                id: entryId,
                workspaceId,
                createdById: memberId,
                isDeleted: false,
            },
            relations: [
                'project',
                'task',
                'createdBy',
                'updatedBy',
                'parentEntry',
                'subEntries',
            ],
        });

        if (!entry) {
            throw new NotFoundException('Time entry not found');
        }

        return entry;
    }
}
