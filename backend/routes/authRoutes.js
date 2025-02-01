import express from 'express';
import {
  login,
  register,
  verifyCredentials,
  resetPassword
} from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/verify-credentials', verifyCredentials);
router.post('/reset-password', resetPassword);

export default router;