import { z } from 'zod';

export const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required'),
  parentCommentId: z.string().uuid().optional(),
  mentionedMemberIds: z
    .union([
      z.array(z.string().uuid()),
      z.string().transform((str) => {
        try {
          const parsed = JSON.parse(str);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      }),
    ])
    .optional(),
});

export type CreateCommentDto = z.infer<typeof createCommentSchema>;

export const updateCommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required').optional(),
  mentionedMemberIds: z.array(z.string().uuid()).optional(),
});

export type UpdateCommentDto = z.infer<typeof updateCommentSchema>;

export const addReactionSchema = z.object({
  emoji: z.string().min(1, 'Emoji is required'),
});

export type AddReactionDto = z.infer<typeof addReactionSchema>;
