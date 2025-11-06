import { z } from 'zod';

export const createListSchema = z.object({
  name: z
    .string()
    .min(1, 'List name is required')
    .max(100, 'List name must not exceed 100 characters')
    .trim(),
  isPrivate: z.boolean().optional().default(false),
});

export const updateListSchema = z.object({
  name: z
    .string()
    .min(1, 'List name is required')
    .max(100, 'List name must not exceed 100 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .trim()
    .nullable()
    .optional(),
  isPrivate: z.boolean().optional(),
});

export const tagSchema = z.object({
  value: z.string().min(1, 'Tag value is required'),
  label: z.string().min(1, 'Tag label is required'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
  index: z.number().int().min(0),
});

export const manageTagsSchema = z.object({
  tagsToCreate: z.array(tagSchema).optional().default([]),
  tagsToUpdate: z
    .array(
      z.object({
        oldValue: z.string().min(1, 'Old value is required'),
        newTag: tagSchema,
      }),
    )
    .optional()
    .default([]),
  tagsToDelete: z.array(z.string()).optional().default([]),
});

export type CreateListDto = z.infer<typeof createListSchema>;
export type UpdateListDto = z.infer<typeof updateListSchema>;
export type TagDto = z.infer<typeof tagSchema>;
export type ManageTagsDto = z.infer<typeof manageTagsSchema>;
