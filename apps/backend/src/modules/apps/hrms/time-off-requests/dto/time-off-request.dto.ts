import { z } from 'zod';
import { TimeOffType } from '../schemas/time-off-request.schema';

export const createTimeOffRequestSchema = z.object({
  type: z.nativeEnum(TimeOffType, {
    required_error: 'Time off type is required',
  }),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid start date',
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid end date',
  }),
  reason: z.string().max(1000).optional(),
  coverById: z.string().uuid().optional(),
});

export type CreateTimeOffRequestDto = z.infer<typeof createTimeOffRequestSchema>;

export const updateTimeOffRequestSchema = z.object({
  type: z.nativeEnum(TimeOffType).optional(),
  startDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid start date',
    })
    .optional(),
  endDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid end date',
    })
    .optional(),
  reason: z.string().max(1000).optional(),
  coverById: z.string().uuid().optional(),
});

export type UpdateTimeOffRequestDto = z.infer<typeof updateTimeOffRequestSchema>;

export const approveTimeOffRequestSchema = z.object({
  note: z.string().max(500).optional(),
});

export type ApproveTimeOffRequestDto = z.infer<
  typeof approveTimeOffRequestSchema
>;

export const rejectTimeOffRequestSchema = z.object({
  note: z.string().min(1, 'Rejection reason is required').max(500),
});

export type RejectTimeOffRequestDto = z.infer<typeof rejectTimeOffRequestSchema>;
