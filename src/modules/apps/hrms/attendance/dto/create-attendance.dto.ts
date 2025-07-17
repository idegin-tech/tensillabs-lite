import { z } from 'zod';

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
