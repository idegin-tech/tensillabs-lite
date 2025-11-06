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

export const tagUpdateSchema = z.object({
  oldValue: z.string().min(1, 'Old value is required'),
  newTag: tagSchema,
});

export const manageTagsSchema = z.object({
  tagsToCreate: z.array(tagSchema).default([]),
  tagsToUpdate: z.array(tagUpdateSchema).default([]),
  tagsToDelete: z.array(z.string()).default([]),
});

export type CreateListDto = z.infer<typeof createListSchema>;
export type UpdateListDto = z.infer<typeof updateListSchema>;

export interface TagDto {
  value: string;
  label: string;
  color: string;
  index: number;
}

export interface ManageTagsDto {
  tagsToCreate: TagDto[];
  tagsToUpdate: Array<{
    oldValue: string;
    newTag: TagDto;
  }>;
  tagsToDelete: string[];
}
