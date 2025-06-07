import { z } from 'zod';

export const inviteMemberSchema = z.object({
  primaryEmail: z.string().email('Invalid email format').toLowerCase().trim(),
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
  workPhone: z
    .string()
    .max(20, 'Office phone must not exceed 20 characters')
    .trim()
    .optional(),
});

export type InviteMemberDto = z.infer<typeof inviteMemberSchema>;
