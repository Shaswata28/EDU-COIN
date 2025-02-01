import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { updateBudget, getBudgets } from '../controllers/budgetController.js';

const router = express.Router();

router.get('/', protect, getBudgets);
router.put('/', protect, updateBudget);

export default router;