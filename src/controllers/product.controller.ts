import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';

export const createProduct = asyncHandler(async (req: any, res: Response) => {
  const product = await ProductService.createProduct(req.body, req.user.id);
  res.status(201).json(new ApiResponse(201, product, 'Product created successfully'));
});

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const result = await ProductService.getProducts(req.query);
  res.status(200).json(new ApiResponse(200, result, 'Products fetched successfully'));
});

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const product = await ProductService.getProductById(req.params.id as string);
  res.status(200).json(new ApiResponse(200, product, 'Product fetched successfully'));
});

export const updateProduct = asyncHandler(async (req: any, res: Response) => {
  const product = await ProductService.updateProduct(req.params.id as string, req.body, req.user.id);
  res.status(200).json(new ApiResponse(200, product, 'Product updated successfully'));
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  await ProductService.deleteProduct(req.params.id as string);
  res.status(200).json(new ApiResponse(200, null, 'Product deleted successfully'));
});

export const changeProductStatus = asyncHandler(async (req: any, res: Response) => {
  const product = await ProductService.changeStatus(req.params.id as string, req.body.status, req.user.id);
  res.status(200).json(new ApiResponse(200, product, `Product status changed to ${req.body.status}`));
});
