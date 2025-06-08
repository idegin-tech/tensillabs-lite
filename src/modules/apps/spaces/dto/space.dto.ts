import { z } from 'zod';

export const createSpaceSchema = z.object({
  name: z
    .string()
    .min(1, 'Space name is required')
    .max(100, 'Space name must not exceed 100 characters')
    .trim(),
});

export type CreateSpaceDto = z.infer<typeof createSpaceSchema>;
