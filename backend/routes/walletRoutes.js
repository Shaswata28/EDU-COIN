import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  getWalletBalance, 
  topUpWallet,
  verifyPayment 
} from '../controllers/walletController.js';

const router = express.Router();

router.get('/balance', protect, getWalletBalance);
router.post('/topup', protect, topUpWallet);
router.post('/verify-payment', protect, verifyPayment);

export default router;