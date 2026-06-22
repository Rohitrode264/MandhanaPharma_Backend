import { z } from 'zod';

export const createTagSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    group: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const updateTagSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    name: z.string().optional(),
    group: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});
