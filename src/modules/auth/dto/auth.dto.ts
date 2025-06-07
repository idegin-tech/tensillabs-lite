import { z } from 'zod';
import * as moment from 'moment-timezone';

const validateTimezone = (timezone: string): boolean => {
  return moment.tz.zone(timezone) !== null;
};

export const loginSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(1),
});

export const registerSchema = z
  .object({
    email: z.string().email().trim().toLowerCase(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    timezone: z.string().min(1).refine(validateTimezone, {
      message: 'Invalid timezone provided',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const verifyEmailSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export const resendOtpSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
});

export type LoginDto = z.infer<typeof loginSchema>;
export type RegisterDto = z.infer<typeof registerSchema>;
export type VerifyEmailDto = z.infer<typeof verifyEmailSchema>;
export type ResendOtpDto = z.infer<typeof resendOtpSchema>;
