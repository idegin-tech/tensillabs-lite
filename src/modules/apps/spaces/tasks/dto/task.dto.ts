import { z } from 'zod';

export const createTaskSchema = z.object({
  name: z
    .string()
    .min(1, 'Task name is required')
    .max(200, 'Task name must not exceed 200 characters')
    .trim(),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
