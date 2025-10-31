import express from 'express';
import {
  getTags,
  getTag,
  createTag,
  updateTag,
  deleteTag,
} from '../controllers/tag.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/', getTags);
router.get('/:id', getTag);

// Protected routes (admin only)
router.post('/', protect, authorize('admin'), createTag);
router.put('/:id', protect, authorize('admin'), updateTag);
router.delete('/:id', protect, authorize('admin'), deleteTag);

export default router;
