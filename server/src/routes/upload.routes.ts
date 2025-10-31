import express from 'express';
import { uploadImage, uploadMultipleImages } from '../controllers/upload.controller';
import { protect } from '../middleware/auth.middleware';
import upload from '../middleware/upload.middleware';

const router = express.Router();

// All routes are protected
router.use(protect);

// Upload single image
router.post('/', upload.single('image'), uploadImage);

// Upload multiple images
router.post('/multiple', upload.array('images', 10), uploadMultipleImages);

export default router;
