import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getUserAnalytics,
  exportTransactionsPDF,
  exportTransactionsExcel
} from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/user', protect, getUserAnalytics);
router.get('/export/pdf', protect, exportTransactionsPDF);
router.get('/export/excel', protect, exportTransactionsExcel);

export default router;