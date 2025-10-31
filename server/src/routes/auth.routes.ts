import express from 'express';
import { register, login, logout, getMe } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { corsMiddleware } from '../middleware/cors.middleware';

const router = express.Router();

// Apply CORS middleware specifically to auth routes for extra assurance
router.use(corsMiddleware);


router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);

export default router;
