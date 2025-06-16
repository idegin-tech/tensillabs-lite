import { z } from 'zod';

export const createProjectSchema = z
  .object({
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
    client: z.string().optional(),
  })
  .strict();

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
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
  client: z
    .string()
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
});

export const toggleActiveSchema = z.object({
  isActive: z.boolean(),
});

export type CreateProjectDto = z.infer<typeof createProjectSchema>;
export type UpdateProjectDto = z.infer<typeof updateProjectSchema>;
export type ToggleActiveDto = z.infer<typeof toggleActiveSchema>;
