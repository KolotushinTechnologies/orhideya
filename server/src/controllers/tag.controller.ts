import { Request, Response, NextFunction } from 'express';
import Tag from '../models/tag.model';
import ErrorResponse from '../utils/error-response';
import asyncHandler from '../utils/async-handler';

// @desc    Get all tags
// @route   GET /api/tags
// @access  Public
export const getTags = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const tags = await Tag.find();

  res.status(200).json({
    success: true,
    count: tags.length,
    data: tags,
  });
});

// @desc    Get single tag
// @route   GET /api/tags/:id
// @access  Public
export const getTag = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const tag = await Tag.findById(req.params.id);

  if (!tag) {
    return next(new ErrorResponse(`Tag not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: tag,
  });
});

// @desc    Create new tag
// @route   POST /api/tags
// @access  Private/Admin
export const createTag = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const tag = await Tag.create(req.body);

  res.status(201).json({
    success: true,
    data: tag,
  });
});

// @desc    Update tag
// @route   PUT /api/tags/:id
// @access  Private/Admin
export const updateTag = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let tag = await Tag.findById(req.params.id);

  if (!tag) {
    return next(new ErrorResponse(`Tag not found with id of ${req.params.id}`, 404));
  }

  tag = await Tag.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: tag,
  });
});

// @desc    Delete tag
// @route   DELETE /api/tags/:id
// @access  Private/Admin
export const deleteTag = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const tag = await Tag.findById(req.params.id);

  if (!tag) {
    return next(new ErrorResponse(`Tag not found with id of ${req.params.id}`, 404));
  }

  await tag.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
