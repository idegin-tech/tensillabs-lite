import { z } from 'zod';
import { TaskPriority, TaskStatus } from '../schemas/task.schema';

export const syncTaskSchema = z.object({
  task_id: z.string().min(1, 'Task ID is required'),
  name: z
    .string()
    .min(1, 'Task name is required')
    .max(200, 'Task name must not exceed 200 characters')
    .trim(),
  priority: z.nativeEnum(TaskPriority).nullable().optional(),
  status: z.nativeEnum(TaskStatus),
  timeframe: z
    .object({
      start: z.date().optional(),
      end: z.date().optional(),
    })
    .nullable()
    .optional(),
  assignee: z.array(z.string()).optional(),
});

export const syncTasksSchema = z.object({
  tasks: z.array(syncTaskSchema),
});

export const updateTaskSchema = z.object({
  name: z
    .string()
    .min(1, 'Task name is required')
    .max(200, 'Task name must not exceed 200 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .max(1000, 'Description must not exceed 1000 characters')
    .trim()
    .nullable()
    .optional(),
});

export const getTasksByListQuerySchema = z.object({
  groupBy: z.enum(['status', 'priority']).optional().default('status'),
  meMode: z
    .string()
    .optional()
    .default('false')
    .transform((val) => val === 'true'),
  dueDate: z
    .string()
    .transform((val) => new Date(val))
    .pipe(z.date())
    .optional(),
});

export type SyncTaskDto = z.infer<typeof syncTaskSchema>;
export type SyncTasksDto = z.infer<typeof syncTasksSchema>;
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
export type GetTasksByListQueryDto = z.infer<typeof getTasksByListQuerySchema>;
