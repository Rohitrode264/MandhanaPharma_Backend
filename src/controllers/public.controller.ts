import { Request, Response } from 'express';
import { CategoryService } from '../services/category.service';
import { TagService } from '../services/tag.service';
import { ProductService } from '../services/product.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ProductStatus } from '../constants/enums';

export const getPublicCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await CategoryService.getCategories({ isActive: true });
  res.status(200).json(new ApiResponse(200, categories, 'Categories fetched successfully'));
});

export const getPublicTags = asyncHandler(async (req: Request, res: Response) => {
  const tags = await TagService.getTags({ isActive: true });
  res.status(200).json(new ApiResponse(200, tags, 'Tags fetched successfully'));
});

export const getPublicProducts = asyncHandler(async (req: Request, res: Response) => {
  // Force status to published for public API
  req.query.status = ProductStatus.PUBLISHED;
  const result = await ProductService.getProducts(req.query);
  res.status(200).json(new ApiResponse(200, result, 'Products fetched successfully'));
});

export const getPublicProductBySlug = asyncHandler(async (req: Request, res: Response) => {
  const product = await ProductService.getProductBySlug(req.params.slug as string, true);
  res.status(200).json(new ApiResponse(200, product, 'Product fetched successfully'));
});

export const getPublicDosageForms = asyncHandler(async (req: Request, res: Response) => {
  const dosageForms = await ProductService.getDistinctDosageForms();
  res.status(200).json(new ApiResponse(200, dosageForms, 'Dosage forms fetched successfully'));
});
