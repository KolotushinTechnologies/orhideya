import { Request, Response } from 'express';
import Like from '../models/like.model';
import Product from '../models/product.model';

// Helper function to get client IP address
const getClientIp = (req: Request): string => {
  // Check for X-Forwarded-For header (when behind proxy)
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ips = (forwarded as string).split(',');
    return ips[0].trim();
  }
  
  // Check for X-Real-IP header
  const realIp = req.headers['x-real-ip'];
  if (realIp) {
    return realIp as string;
  }
  
  // Fallback to socket address
  return req.socket.remoteAddress || 'unknown';
};

// Toggle like for a product
export const toggleLike = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const ipAddress = getClientIp(req);

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if like already exists
    const existingLike = await Like.findOne({ productId, ipAddress });

    if (existingLike) {
      // Unlike - remove the like
      await Like.deleteOne({ _id: existingLike._id });
      
      // Get updated like count
      const likeCount = await Like.countDocuments({ productId });
      
      return res.json({
        success: true,
        data: {
          liked: false,
          likeCount,
        },
      });
    } else {
      // Like - create new like
      await Like.create({ productId, ipAddress });
      
      // Get updated like count
      const likeCount = await Like.countDocuments({ productId });
      
      return res.json({
        success: true,
        data: {
          liked: true,
          likeCount,
        },
      });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling like',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get likes for current user (by IP)
export const getUserLikes = async (req: Request, res: Response) => {
  try {
    const ipAddress = getClientIp(req);

    const likes = await Like.find({ ipAddress }).select('productId');
    const likedProductIds = likes.map(like => like.productId.toString());

    res.json({
      success: true,
      data: likedProductIds,
    });
  } catch (error) {
    console.error('Error getting user likes:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting user likes',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get like counts for all products
export const getAllLikeCounts = async (req: Request, res: Response) => {
  try {
    const likeCounts = await Like.aggregate([
      {
        $group: {
          _id: '$productId',
          count: { $sum: 1 },
        },
      },
    ]);

    // Convert to object format { productId: count }
    const countsMap: Record<string, number> = {};
    likeCounts.forEach(item => {
      countsMap[item._id.toString()] = item.count;
    });

    res.json({
      success: true,
      data: countsMap,
    });
  } catch (error) {
    console.error('Error getting like counts:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting like counts',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get like count for a specific product
export const getProductLikeCount = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const ipAddress = getClientIp(req);

    const likeCount = await Like.countDocuments({ productId });
    const isLiked = await Like.exists({ productId, ipAddress });

    res.json({
      success: true,
      data: {
        likeCount,
        liked: !!isLiked,
      },
    });
  } catch (error) {
    console.error('Error getting product like count:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting product like count',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
