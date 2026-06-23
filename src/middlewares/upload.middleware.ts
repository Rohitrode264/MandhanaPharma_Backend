import multer from 'multer';
import path from 'path';
import { ApiError } from '../utils/ApiError';

function checkFileType(
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  const filetypes = /jpg|jpeg|png|webp|pdf/;

  const extname = filetypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimetype =
    file.mimetype.startsWith('image/') ||
    file.mimetype === 'application/pdf';

  if (extname && mimetype) {
    return cb(null, true);
  }

  cb(new ApiError(400, 'Images and PDFs only!'));
}

export const uploadMemory = multer({
  storage: multer.memoryStorage(),
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
});

export const upload = uploadMemory;