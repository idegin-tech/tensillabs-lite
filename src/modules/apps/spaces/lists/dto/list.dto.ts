import { z } from 'zod';

export const createListSchema = z.object({
  name: z
    .string()
    .min(1, 'List name is required')
    .max(100, 'List name must not exceed 100 characters')
    .trim(),
  isPrivate: z.boolean().optional().default(false),
});

export const updateListSchema = z.object({
  name: z
    .string()
    .min(1, 'List name is required')
    .max(100, 'List name must not exceed 100 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .trim()
    .nullable()
    .optional(),
  isPrivate: z.boolean().optional(),
});

export type CreateListDto = z.infer<typeof createListSchema>;
export type UpdateListDto = z.infer<typeof updateListSchema>;
