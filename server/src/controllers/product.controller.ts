import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Product from '../models/product.model';
import ErrorResponse from '../utils/error-response';
import asyncHandler from '../utils/async-handler';

// @desc    Get all products with filtering, sorting, pagination
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit', 'search'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  let query = Product.find(JSON.parse(queryStr));

  // Handle text search
  if (req.query.search) {
    const searchQuery = { $text: { $search: req.query.search as string } };
    query = Product.find(searchQuery);
  }

  // Select Fields
  if (req.query.select) {
    const fields = (req.query.select as string).split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = (req.query.sort as string).split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Product.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Populate with category and tags
  query = query.populate([
    { path: 'category', select: 'name color' },
    { path: 'tags', select: 'name' }
  ]);

  // Executing query
  const products = await query;

  // Pagination result
  const pagination: any = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: products.length,
    pagination,
    data: products
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const product = await Product.findById(req.params.id).populate([
    { path: 'category', select: 'name color' },
    { path: 'tags', select: 'name' }
  ]);

  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Validate category
  if (req.body.category) {
    try {
      const isValidId = mongoose.Types.ObjectId.isValid(req.body.category);
      if (!isValidId) {
        return next(new ErrorResponse(`Invalid category ID`, 400));
      }
    } catch (err) {
      return next(new ErrorResponse(`Invalid category ID`, 400));
    }
  }

  // Validate tags
  if (req.body.tags && Array.isArray(req.body.tags)) {
    for (const tagId of req.body.tags) {
      try {
        const isValidId = mongoose.Types.ObjectId.isValid(tagId);
        if (!isValidId) {
          return next(new ErrorResponse(`Invalid tag ID: ${tagId}`, 400));
        }
      } catch (err) {
        return next(new ErrorResponse(`Invalid tag ID: ${tagId}`, 400));
      }
    }
  }

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    data: product
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  // Validate category if provided
  if (req.body.category) {
    try {
      const isValidId = mongoose.Types.ObjectId.isValid(req.body.category);
      if (!isValidId) {
        return next(new ErrorResponse(`Invalid category ID`, 400));
      }
    } catch (err) {
      return next(new ErrorResponse(`Invalid category ID`, 400));
    }
  }

  // Validate tags if provided
  if (req.body.tags && Array.isArray(req.body.tags)) {
    for (const tagId of req.body.tags) {
      try {
        const isValidId = mongoose.Types.ObjectId.isValid(tagId);
        if (!isValidId) {
          return next(new ErrorResponse(`Invalid tag ID: ${tagId}`, 400));
        }
      } catch (err) {
        return next(new ErrorResponse(`Invalid tag ID: ${tagId}`, 400));
      }
    }
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate([
    { path: 'category', select: 'name color' },
    { path: 'tags', select: 'name' }
  ]);

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const limit = parseInt(req.query.limit as string, 10) || 5;
  
  const products = await Product.find({ featured: true })
    .limit(limit)
    .populate([
      { path: 'category', select: 'name color' },
      { path: 'tags', select: 'name' }
    ]);

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Get products by category
// @route   GET /api/products/category/:categoryId
// @access  Public
export const getProductsByCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const products = await Product.find({ category: req.params.categoryId })
    .populate([
      { path: 'category', select: 'name color' },
      { path: 'tags', select: 'name' }
    ]);

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Get products by tag
// @route   GET /api/products/tag/:tagId
// @access  Public
export const getProductsByTag = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const products = await Product.find({ tags: req.params.tagId })
    .populate([
      { path: 'category', select: 'name color' },
      { path: 'tags', select: 'name' }
    ]);

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});
