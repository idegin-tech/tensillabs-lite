import { z } from 'zod';

export const getListFilesQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  search: z.string().trim().optional(),
  mimeType: z.string().trim().optional(),
  sortBy: z.enum(['name', 'size', 'createdAt', 'uploadedAt']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type GetListFilesQueryDto = z.infer<typeof getListFilesQuerySchema>;
