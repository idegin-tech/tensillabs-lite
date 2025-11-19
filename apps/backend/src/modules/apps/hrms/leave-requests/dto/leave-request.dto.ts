import { z } from 'zod';
import { LeaveType } from '../schemas/leave-request.schema';

export const createLeaveRequestSchema = z.object({
  type: z.nativeEnum(LeaveType, {
    required_error: 'Leave type is required',
  }),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid start date',
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid end date',
  }),
  reason: z.string().max(1000).optional(),
});

export type CreateLeaveRequestDto = z.infer<typeof createLeaveRequestSchema>;

export const updateLeaveRequestSchema = z.object({
  type: z.nativeEnum(LeaveType).optional(),
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
});

export type UpdateLeaveRequestDto = z.infer<typeof updateLeaveRequestSchema>;

export const approveLeaveRequestSchema = z.object({
  note: z.string().max(500).optional(),
});

export type ApproveLeaveRequestDto = z.infer<
  typeof approveLeaveRequestSchema
>;

export const rejectLeaveRequestSchema = z.object({
  note: z.string().min(1, 'Rejection reason is required').max(500),
});

export type RejectLeaveRequestDto = z.infer<typeof rejectLeaveRequestSchema>;
