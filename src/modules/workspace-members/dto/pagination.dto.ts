import { z } from 'zod';

export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val > 0, {
      message: 'Page must be greater than 0',
    }),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => val > 0 && val <= 100, {
      message: 'Limit must be between 1 and 100',
    }),
  sortBy: z.string().optional().default('-createdAt'),
  search: z.string().optional(),
  // Additional pagination options for mongoose-paginate-v2
  populate: z.union([z.string(), z.array(z.string())]).optional(),
  select: z.string().optional(),
  lean: z.boolean().optional().default(false),
});

export type PaginationDto = z.infer<typeof paginationSchema>;

// Helper function to extract pagination options for mongoose-paginate-v2
export const extractPaginationOptions = (pagination: PaginationDto) => {
  const { search, ...paginationOptions } = pagination;
  return {
    search,
    paginationOptions: {
      page: paginationOptions.page,
      limit: paginationOptions.limit,
      sort: paginationOptions.sortBy,
      populate: paginationOptions.populate,
      select: paginationOptions.select,
      lean: paginationOptions.lean,
    },
  };
};
