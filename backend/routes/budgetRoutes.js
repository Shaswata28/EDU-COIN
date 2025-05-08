import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  updateBudget, 
  getBudgets,
  getMonthlyReport 
} from '../controllers/budgetController.js';

const router = express.Router();

router.get('/', protect, getBudgets);
router.put('/', protect, updateBudget);
router.get('/report', protect, getMonthlyReport);

export default router;
