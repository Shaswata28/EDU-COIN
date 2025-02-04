import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { getAnalytics } from '../controllers/analyticsController.js';
import {
  getAllUsers,
  getUserByStudentId,
  updateUser,
  deleteUser,
  toggleUserStatus
} from '../controllers/adminController.js';

const router = express.Router();

// User management routes
router.get('/users', protect, admin, getAllUsers);
router.get('/users/:studentId', protect, admin, getUserByStudentId);
router.put('/users/:id', protect, admin, updateUser);
router.delete('/users/:id', protect, admin, deleteUser);
router.put('/users/:id/status', protect, admin, toggleUserStatus);

// Analytics route
router.get('/analytics', protect, admin, getAnalytics);

export default router;