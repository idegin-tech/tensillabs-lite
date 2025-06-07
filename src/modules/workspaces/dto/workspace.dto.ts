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
  industry: z
    .string()
    .max(50, 'Industry must not exceed 50 characters')
    .trim()
    .optional(),
  website: z
    .string()
    .url('Invalid website URL')
    .max(100, 'Website URL must not exceed 100 characters')
    .optional(),
  location: z
    .string()
    .max(200, 'Location must not exceed 200 characters')
    .trim()
    .optional(),
  plan: z
    .enum(['free', 'standard', 'premium', 'enterprise'])
    .default('standard'),
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
    jobTitle: z
      .string()
      .max(100, 'Job title must not exceed 100 characters')
      .trim()
      .optional(),
    department: z
      .string()
      .max(100, 'Department must not exceed 100 characters')
      .trim()
      .optional(),
    bio: z
      .string()
      .max(500, 'Bio must not exceed 500 characters')
      .trim()
      .optional(),
    phoneNumber: z.string().trim().optional(),
  }),
  settings: z
    .object({
      allowInvites: z.boolean().default(true),
      requireApproval: z.boolean().default(false),
      defaultPermission: z.enum(['regular', 'manager']).default('regular'),
    })
    .optional(),
});

export type CreateWorkspaceDto = z.infer<typeof createWorkspaceSchema>;
