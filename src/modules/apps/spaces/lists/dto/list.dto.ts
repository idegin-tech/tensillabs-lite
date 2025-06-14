import { z } from 'zod';

export const createListSchema = z.object({
  name: z
    .string()
    .min(1, 'List name is required')
    .max(100, 'List name must not exceed 100 characters')
    .trim(),
  isPrivate: z.boolean().optional().default(false),
});

export type CreateListDto = z.infer<typeof createListSchema>;
