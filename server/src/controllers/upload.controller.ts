import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../utils/async-handler';
import ErrorResponse from '../utils/error-response';
import path from 'path';

// @desc    Upload image
// @route   POST /api/upload
// @access  Private
export const uploadImage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const filePath = `/uploads/${path.basename(req.file.path)}`;
  const fileUrl = `${baseUrl}${filePath}`;

  res.status(200).json({
    success: true,
    data: {
      fileName: req.file.filename,
      filePath,
      fileUrl,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
    },
  });
});

// @desc    Upload multiple images
// @route   POST /api/upload/multiple
// @access  Private
export const uploadMultipleImages = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    return next(new ErrorResponse('Please upload at least one file', 400));
  }

  const baseUrl = `${req.protocol}://${req.get('host')}`;
  
  const uploadedFiles = req.files.map((file) => {
    const filePath = `/uploads/${path.basename(file.path)}`;
    const fileUrl = `${baseUrl}${filePath}`;

    return {
      fileName: file.filename,
      filePath,
      fileUrl,
      fileType: file.mimetype,
      fileSize: file.size,
    };
  });

  res.status(200).json({
    success: true,
    count: uploadedFiles.length,
    data: uploadedFiles,
  });
});
