/* eslint-disable prettier/prettier */
import { z } from 'zod';

export const createChecklistSchema = z.object({
  name: z
    .string()
    .min(1, 'Checklist name is required')
    .max(200, 'Checklist name must not exceed 200 characters')
    .trim(),
  task: z.string().optional(),
  space: z.string().optional(),
  list: z.string().optional(),
});

export const updateChecklistSchema = z.object({
  name: z
    .string()
    .min(1, 'Checklist name is required')
    .max(200, 'Checklist name must not exceed 200 characters')
    .trim()
    .optional(),
  isDone: z.boolean().optional(),
});

export const getChecklistsQuerySchema = z.object({
  task: z.string().optional(),
  space: z.string().optional(),
  list: z.string().optional(),
  isDone: z.boolean().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z
    .enum(['name', 'isDone', 'createdAt', 'updatedAt'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateChecklistDto = z.infer<typeof createChecklistSchema>;
export type UpdateChecklistDto = z.infer<typeof updateChecklistSchema>;
export type GetChecklistsQueryDto = z.infer<typeof getChecklistsQuerySchema>;
