import { z } from 'zod';

export const createTimeEntrySchema = z.object({
    description: z.string().max(500).optional(),
    startTime: z.string().datetime(),
    projectId: z.string().uuid().optional(),
    taskId: z.string().uuid().optional(),
});

export type CreateTimeEntryDto = z.infer<typeof createTimeEntrySchema>;

export const resumeTimeEntrySchema = z.object({
    description: z.string().max(500).optional(),
    startTime: z.string().datetime(),
});

export type ResumeTimeEntryDto = z.infer<typeof resumeTimeEntrySchema>;

export const updateTimeEntrySchema = z.object({
    entries: z.array(
        z.object({
            id: z.string().uuid(),
            description: z.string().max(500).optional(),
            startTime: z.string().datetime().optional(),
            endTime: z.string().datetime().optional(),
            projectId: z.string().uuid().optional().nullable(),
            taskId: z.string().uuid().optional().nullable(),
        }),
    ),
});

export type UpdateTimeEntryDto = z.infer<typeof updateTimeEntrySchema>;

export const deleteTimeEntriesSchema = z.object({
    ids: z.array(z.string().uuid()).min(1),
});

export type DeleteTimeEntriesDto = z.infer<typeof deleteTimeEntriesSchema>;

export const getTimeEntriesQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1).optional(),
    limit: z.coerce.number().int().positive().max(100).default(20).optional(),
    projectId: z.string().uuid().optional(),
    taskId: z.string().uuid().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    includeDeleted: z.coerce.boolean().default(false).optional(),
    parentOnly: z.coerce.boolean().default(false).optional(),
});

export type GetTimeEntriesQueryDto = z.infer<typeof getTimeEntriesQuerySchema>;
