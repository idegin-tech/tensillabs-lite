import { z } from 'zod';
import {
  SpacePermission,
  ParticipantStatus,
} from '../schemas/space-participant.schema';

export const inviteParticipantSchema = z.object({
  memberId: z.string().min(1, 'Member ID is required'),
  permissions: z
    .nativeEnum(SpacePermission)
    .optional()
    .default(SpacePermission.REGULAR),
});

export const updateParticipantSchema = z.object({
  permissions: z.nativeEnum(SpacePermission).optional(),
  status: z.nativeEnum(ParticipantStatus).optional(),
});

export type InviteParticipantDto = z.infer<typeof inviteParticipantSchema>;
export type UpdateParticipantDto = z.infer<typeof updateParticipantSchema>;
