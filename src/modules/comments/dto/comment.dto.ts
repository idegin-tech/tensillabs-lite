import { z } from 'zod';

export const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required'),
  parentCommentId: z.string().uuid().optional(),
});

export type CreateCommentDto = z.infer<typeof createCommentSchema>;

export const updateCommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required').optional(),
});

export type UpdateCommentDto = z.infer<typeof updateCommentSchema>;

export const addReactionSchema = z.object({
  emoji: z.string().min(1, 'Emoji is required'),
});

export type AddReactionDto = z.infer<typeof addReactionSchema>;
