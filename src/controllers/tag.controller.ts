import { Request, Response } from 'express';
import { TagService } from '../services/tag.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';

export const createTag = asyncHandler(async (req: Request, res: Response) => {
  const tag = await TagService.createTag(req.body);
  res.status(201).json(new ApiResponse(201, tag, 'Tag created successfully'));
});

export const getTags = asyncHandler(async (req: Request, res: Response) => {
  const tags = await TagService.getTags();
  res.status(200).json(new ApiResponse(200, tags, 'Tags fetched successfully'));
});

export const updateTag = asyncHandler(async (req: Request, res: Response) => {
  const tag = await TagService.updateTag(req.params.id as string, req.body);
  res.status(200).json(new ApiResponse(200, tag, 'Tag updated successfully'));
});

export const deleteTag = asyncHandler(async (req: Request, res: Response) => {
  await TagService.deleteTag(req.params.id as string);
  res.status(200).json(new ApiResponse(200, null, 'Tag deleted successfully'));
});
