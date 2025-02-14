import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  sendMessage,
  getMessages,
  markAsRead,
  deleteMessage,
  sendBroadcast,
  replyToMessage
} from '../controllers/messageController.js';

const router = express.Router();

// Routes
router.post('/', protect, sendMessage);
router.post('/broadcast', protect, admin, sendBroadcast);
router.post('/:id/reply', protect, replyToMessage);
router.get('/', protect, admin, getMessages);
router.put('/:id/read', protect, admin, markAsRead);
router.delete('/:id', protect, admin, deleteMessage);

export default router;