import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import { getWalletBalance, topUpWallet ,verifyPayment } from './controllers/walletController.js';
import { admin, protect } from './middleware/authMiddleware.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';
import { login, register, resetPassword , verifyCredentials} from './controllers/authController.js';
import { getUserByStudentId, updateUser, deleteUser } from './controllers/adminController.js';
import { processPayment } from './controllers/paymentController.js';
import { getTransactionHistory } from './controllers/transactionController.js';
import { getProfile, updateProfile, updatePassword } from './controllers/profileController.js';
import messageRoutes from './routes/messageRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';

dotenv.config();
const app = express();

app.use(cors({
  origin: 'https://edu-coin.vercel.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));
app.options('*', cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Create initial admin  users
const createInitialUsers = async () => {
  try {
    // Create admin user
    const adminExists = await User.findOne({ username: 'ADMIN' });
    if (!adminExists) {
      await User.create({
        username: 'ADMIN',
        password: 'admin@123',
        pin: '12345',
        email: 'admin@eastdelta.edu.bd',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
      });
    }
    
  } catch (error) {
    console.error('Error creating initial users:', error);
  }
};

createInitialUsers();

// Routes
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.get('/api/wallet/balance', protect, getWalletBalance);
app.post('/api/wallet/topup', protect, topUpWallet);
app.post('/api/wallet/topup', protect, verifyPayment);

// Admin routes
app.get('/api/admin/users/:studentId', getUserByStudentId);
app.put('/api/admin/users/:id', updateUser);
app.delete('/api/admin/users/:id', protect, admin, deleteUser);
app.use('/api/admin', adminRoutes);

//transaction history
app.get('/api/transactions', protect, getTransactionHistory);
app.post('/api/payment', protect, processPayment);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/achievements', achievementRoutes);

//Forgot password

//app.post('/api/auth/forgot-password', forgotPassword);
app.post('/api/auth/verify-credentials', verifyCredentials);
app.post('/api/auth/reset-password', resetPassword);

// Profile routes
app.get('/api/profile', protect, getProfile);
app.put('/api/profile', protect, updateProfile);
app.put('/api/profile/password', protect, updatePassword);

// Message Routes
app.use('/api/messages', messageRoutes);

const PORT =  5100;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});