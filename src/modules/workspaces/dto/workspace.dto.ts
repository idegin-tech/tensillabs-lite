import { z } from 'zod';

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(1, 'Workspace name is required')
    .max(100, 'Workspace name must not exceed 100 characters')
    .trim(),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .trim()
    .optional(),
  logoURL: z.string().url('Invalid logo URL').optional(),
  bannerURL: z.string().url('Invalid banner URL').optional(),
  memberInfo: z.object({
    firstName: z
      .string()
      .min(1, 'First name is required')
      .max(50, 'First name must not exceed 50 characters')
      .trim(),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .max(50, 'Last name must not exceed 50 characters')
      .trim(),
    middleName: z
      .string()
      .max(50, 'Middle name must not exceed 50 characters')
      .trim()
      .optional(),
    bio: z
      .string()
      .max(500, 'Bio must not exceed 500 characters')
      .trim()
      .optional(),
    workPhone: z.string().trim().optional(),
    mobilePhone: z.string().trim().optional(),
  }),
});

export type CreateWorkspaceDto = z.infer<typeof createWorkspaceSchema>;
