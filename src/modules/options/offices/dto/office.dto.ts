import { z } from 'zod';

export const createOfficeSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Office name is required')
      .max(100, 'Office name must not exceed 100 characters')
      .trim(),
    description: z
      .string()
      .max(500, 'Description must not exceed 500 characters')
      .trim()
      .optional(),
    address: z
      .string()
      .max(500, 'Address must not exceed 500 characters')
      .trim()
      .optional(),
  })
  .strict();

export const updateOfficeSchema = z.object({
  name: z
    .string()
    .min(1, 'Office name is required')
    .max(100, 'Office name must not exceed 100 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .trim()
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
  address: z
    .string()
    .max(500, 'Address must not exceed 500 characters')
    .trim()
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
});

export const toggleActiveSchema = z.object({
  isActive: z.boolean(),
});

export type CreateOfficeDto = z.infer<typeof createOfficeSchema>;
export type UpdateOfficeDto = z.infer<typeof updateOfficeSchema>;
export type ToggleActiveDto = z.infer<typeof toggleActiveSchema>;
