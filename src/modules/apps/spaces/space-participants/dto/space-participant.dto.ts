import { z } from 'zod';
import {
  SpaceRole,
  ParticipantStatus,
} from '../schemas/space-participant.schema';

export const inviteParticipantSchema = z.object({
  memberId: z.string().min(1, 'Member ID is required'),
});

export const updateParticipantSchema = z.object({
  role: z.nativeEnum(SpaceRole).optional(),
  status: z.nativeEnum(ParticipantStatus).optional(),
});

export type InviteParticipantDto = z.infer<typeof inviteParticipantSchema>;
export type UpdateParticipantDto = z.infer<typeof updateParticipantSchema>;
