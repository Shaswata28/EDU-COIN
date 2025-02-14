import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import Transaction from '../models/Transaction.js';
import { updateAchievements } from './achievementController.js';
import { createNotification } from './notificationController.js';

export const processPayment = async (req, res) => {
  try {
    const { category, amount, description, pin } = req.body;
    const userId = req.user._id;

    // Input validation
    if (!category || !amount || !pin) {
      return res.status(400).json({ 
        message: 'Category, amount, and PIN are required' 
      });
    }

    if (amount <= 0) {
      return res.status(400).json({ 
        message: 'Amount must be greater than 0' 
      });
    }

    // Validate user and PIN
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPinValid = await user.matchPin(pin);
    if (!isPinValid) {
      return res.status(401).json({ message: 'Invalid PIN' });
    }

    // Check wallet balance
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({ 
        message: 'Insufficient balance',
        balance: wallet.balance
      });
    }

    // Create transaction with pending status
    const transaction = await Transaction.create({
      userId,
      amount,
      transactionType: 'purchase',
      category,
      description: description || `Payment for ${category}`,
      status: 'pending'
    });

    try {
      // Update wallet balance
      wallet.balance -= amount;
      await wallet.save();

      // Mark transaction as completed
      transaction.status = 'completed';
      await transaction.save();

      // Create notification
      await createNotification({
        userId,
        title: 'Payment Successful',
        message: `Your payment of ৳${amount} for ${category} was successful.`,
        type: 'payment'
      });

      // Update achievements after successful payment
      await updateAchievements(userId);

      // Return success response
      res.json({
        success: true,
        message: 'Payment successful',
        transactionId: transaction.transactionId,
        balance: wallet.balance,
        transaction: {
          id: transaction._id,
          amount,
          category,
          description: transaction.description,
          date: transaction.transactionDate
        }
      });
    } catch (error) {
      // If wallet update fails, revert transaction status
      transaction.status = 'failed';
      await transaction.save();
      throw error;
    }
  } catch (error) {
    console.error('Payment error:', error);
    
    // Send appropriate error response
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Invalid payment data',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    if (error.name === 'MongoError' && error.code === 11000) {
      return res.status(400).json({ 
        message: 'Duplicate transaction detected' 
      });
    }

    res.status(500).json({ 
      message: 'Payment failed. Please try again.' 
    });
  }
};