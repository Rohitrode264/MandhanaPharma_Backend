import { z } from 'zod';
import { CategoryScope } from '../constants/enums';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    scope: z.nativeEnum(CategoryScope),
    description: z.string().optional(),
    parentCategory: z.string().optional(), // Mongo ID as string
    isActive: z.boolean().optional(),
    sortOrder: z.number().optional(),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    name: z.string().optional(),
    scope: z.nativeEnum(CategoryScope).optional(),
    description: z.string().optional(),
    parentCategory: z.string().optional(),
    isActive: z.boolean().optional(),
    sortOrder: z.number().optional(),
  }),
});
