import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { getAnalytics } from '../controllers/analyticsController.js';
import {
  getUserByStudentId,
  updateUser,
  deleteUser
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/users/:studentId', protect, admin, getUserByStudentId);
router.put('/users/:id', protect, admin, updateUser);
router.delete('/users/:id', protect, admin, deleteUser);
router.get('/analytics', protect, admin, getAnalytics);

export default router;