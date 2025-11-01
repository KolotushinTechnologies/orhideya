import { Router } from 'express';
import {
  toggleLike,
  getUserLikes,
  getAllLikeCounts,
  getProductLikeCount,
} from '../controllers/like.controller';

const router = Router();

// Toggle like for a product
router.post('/products/:productId/like', toggleLike);

// Get all likes for current user (by IP)
router.get('/likes/user', getUserLikes);

// Get like counts for all products
router.get('/likes/counts', getAllLikeCounts);

// Get like count for a specific product
router.get('/products/:productId/likes', getProductLikeCount);

export default router;
