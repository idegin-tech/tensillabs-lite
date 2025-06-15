import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdSchema = z
  .string()
  .transform((val) => val.trim())
  .refine((val) => val === '' || Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId format',
  })
  .transform((val) => (val === '' ? undefined : val))
  .optional();

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Project name is required')
    .max(100, 'Project name must not exceed 100 characters')
    .trim(),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .trim()
    .optional(),
  client: objectIdSchema,
});

export const updateProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Project name is required')
    .max(100, 'Project name must not exceed 100 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .trim()
    .optional(),
  client: objectIdSchema,
});

export type CreateProjectDto = z.infer<typeof createProjectSchema>;
export type UpdateProjectDto = z.infer<typeof updateProjectSchema>;
