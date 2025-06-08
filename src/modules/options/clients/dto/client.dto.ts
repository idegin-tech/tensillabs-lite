import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdSchema = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId format',
});

export const createClientSchema = z.object({
  name: z
    .string()
    .min(1, 'Client name is required')
    .max(100, 'Client name must not exceed 100 characters')
    .trim(),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .trim()
    .optional(),
  offices: z.array(objectIdSchema).optional().default([]),
});

export const updateClientSchema = z.object({
  name: z
    .string()
    .min(1, 'Client name is required')
    .max(100, 'Client name must not exceed 100 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .trim()
    .optional(),
  offices: z.array(objectIdSchema).optional(),
});

export const toggleActiveSchema = z.object({
  isActive: z.boolean(),
});

export type CreateClientDto = z.infer<typeof createClientSchema>;
export type UpdateClientDto = z.infer<typeof updateClientSchema>;
export type ToggleActiveDto = z.infer<typeof toggleActiveSchema>;
