import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(1),
});

export const registerSchema = z
  .object({
    email: z.string().email().trim().toLowerCase(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    timezone: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type LoginDto = z.infer<typeof loginSchema>;
export type RegisterDto = z.infer<typeof registerSchema>;
