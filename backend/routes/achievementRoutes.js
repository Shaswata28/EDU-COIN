import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getUserAchievements } from '../controllers/achievementController.js';

const router = express.Router();

router.get('/', protect, getUserAchievements);

export default router;