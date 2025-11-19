import { z } from 'zod';

export const clockInSchema = z.object({
  officeId: z.string().uuid().optional(),
  remarks: z.string().max(500).optional(),
});

export type ClockInDto = z.infer<typeof clockInSchema>;

export const clockOutSchema = z.object({
  remarks: z.string().max(500).optional(),
});

export type ClockOutDto = z.infer<typeof clockOutSchema>;

export const createAttendanceSchema = z.object({
  office: z.string().optional(),
  type: z.enum(['clock_in', 'clock_out']),
  remarks: z.string().max(500).optional(),
});

export type CreateAttendanceDto = z.infer<typeof createAttendanceSchema>;

export const toggleAttendanceSchema = z.object({
  office: z.string().optional(),
  remarks: z.string().max(500).optional(),
});

export type ToggleAttendanceDto = z.infer<typeof toggleAttendanceSchema>;
