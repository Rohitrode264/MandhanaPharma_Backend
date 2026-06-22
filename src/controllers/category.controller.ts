import { Request, Response } from 'express';
import { CategoryService } from '../services/category.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await CategoryService.createCategory(req.body);
  res.status(201).json(new ApiResponse(201, category, 'Category created successfully'));
});

export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await CategoryService.getCategories();
  res.status(200).json(new ApiResponse(200, categories, 'Categories fetched successfully'));
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await CategoryService.updateCategory(req.params.id as string, req.body);
  res.status(200).json(new ApiResponse(200, category, 'Category updated successfully'));
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  await CategoryService.deleteCategory(req.params.id as string);
  res.status(200).json(new ApiResponse(200, null, 'Category deleted successfully'));
});
