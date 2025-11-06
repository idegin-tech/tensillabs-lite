/* eslint-disable prettier/prettier */
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
    .max(98000, 'Description must not exceed 98000 characters')
    .trim()
    .nullable()
    .optional(),
  priority: z.nativeEnum(TaskPriority).nullable().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  timeframe: z
    .object({
      start: z
        .string()
        .optional()
        .transform((val) => (val ? new Date(val) : undefined)),
      end: z
        .string()
        .optional()
        .transform((val) => (val ? new Date(val) : undefined)),
    })
    .nullable()
    .optional(),
  assignee: z.array(z.string()).optional(),
  estimatedHours: z.number().min(0).nullable().optional(),
  actualHours: z.number().min(0).nullable().optional(),
  blockedReason: z
    .object({
      reason: z.string().optional(),
      description: z.string().optional(),
      blockedBy: z.string().optional(),
    })
    .nullable()
    .optional(),
  blockedByTaskIds: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export const getTasksByListQuerySchema = z.object({
  groupBy: z
    .enum(['status', 'priority', 'due_date'])
    .optional()
    .default('status'),
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
  status: z
    .enum(['todo', 'in_progress', 'in_review', 'completed', 'canceled'])
    .optional(),
  priority: z.enum(['urgent', 'high', 'normal', 'low', 'none']).optional(),
  due_status: z
    .enum(['overdue', 'today', 'tomorrow', 'this_week', 'later', 'none'])
    .optional(),
});

export const createTaskSchema = z.object({
  name: z
    .string()
    .min(1, 'Task name is required')
    .max(200, 'Task name must not exceed 200 characters')
    .trim(),
  description: z
    .string()
    .max(98000, 'Description must not exceed 98000 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(TaskPriority).optional(),
  timeframe: z
    .object({
      start: z.string().optional(),
      end: z.string().optional(),
    })
    .optional(),
  estimatedHours: z.number().min(0).optional(),
  tags: z.array(z.string()).optional(),
  blockedByTaskIds: z.array(z.string()).optional(),
});

export const createTasksSchema = z.object({
  tasks: z.array(createTaskSchema),
});

export const getTasksByGroupQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, { message: 'Page must be greater than 0' }),
  limit: z
    .string()
    .optional()
    .default('20')
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0 && val <= 100, {
      message: 'Limit must be between 1 and 100',
    }),
  meMode: z
    .string()
    .optional()
    .default('false')
    .transform((val) => val === 'true'),
  status: z
    .enum(['todo', 'in_progress', 'in_review', 'completed', 'canceled'])
    .optional(),
  priority: z.enum(['urgent', 'high', 'normal', 'low', 'none']).optional(),
  due_status: z
    .enum(['overdue', 'today', 'tomorrow', 'this_week', 'later', 'none'])
    .optional(),
  assignee_id: z.string().optional(),
});

export type SyncTaskDto = z.infer<typeof syncTaskSchema>;
export type SyncTasksDto = z.infer<typeof syncTasksSchema>;
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
export type GetTasksByListQueryDto = z.infer<typeof getTasksByListQuerySchema>;
export type CreateTaskDto = z.infer<typeof createTaskSchema>;
export type CreateTasksDto = z.infer<typeof createTasksSchema>;
export type GetTasksByGroupQueryDto = z.infer<
  typeof getTasksByGroupQuerySchema
>;
