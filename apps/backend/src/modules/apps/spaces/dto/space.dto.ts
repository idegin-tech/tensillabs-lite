import { z } from 'zod';

export const createSpaceSchema = z.object({
  name: z
    .string()
    .min(1, 'Space name is required')
    .max(100, 'Space name must not exceed 100 characters')
    .trim()
    .refine((val) => val.length > 0, {
      message: 'Space name cannot be empty or contain only spaces',
    })
    .refine((val) => !/[<>:"/\\|?*]/.test(val), {
      message: 'Space name contains invalid characters',
    }),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .trim()
    .optional(),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format')
    .optional(),
  icon: z.string().optional(),
});

export const updateSpaceSchema = z.object({
  name: z
    .string()
    .min(1, 'Space name is required')
    .max(100, 'Space name must not exceed 100 characters')
    .trim()
    .refine((val) => val.length > 0, {
      message: 'Space name cannot be empty or contain only spaces',
    })
    .refine((val) => !/[<>:"/\\|?*]/.test(val), {
      message: 'Space name contains invalid characters',
    })
    .optional(),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .trim()
    .optional(),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format')
    .optional(),
  icon: z.string().optional(),
});

export type CreateSpaceDto = z.infer<typeof createSpaceSchema>;
export type UpdateSpaceDto = z.infer<typeof updateSpaceSchema>;
