import { Router } from 'express';
import { uploadMemory } from '../middlewares/upload.middleware';
import { protect } from '../middlewares/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { S3Service } from '../services/s3.service';
import { ApiError } from '../utils/ApiError';

const router = Router();

// Protect upload routes to authenticated users
router.use(protect);

router.post(
  '/',
  uploadMemory.single('image'),
  asyncHandler(async (req: any, res) => {
    if (!req.file) {
      throw new ApiError(400, 'Please select a file to upload.');
    }
    const fileUrl = await S3Service.uploadFile(req.file);
    res.status(200).json(new ApiResponse(200, { url: fileUrl }, 'File uploaded successfully'));
  })
);

export default router;
