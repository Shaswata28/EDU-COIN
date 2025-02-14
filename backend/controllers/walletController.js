import Stripe from 'stripe';
import Wallet from '../models/Wallet.js';
import Transaction from '../models/Transaction.js';
import { updateAchievements } from './achievementController.js';
import { createNotification } from './notificationController.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const FRONTEND_URL =  'https://educoin.netlify.app'; 

export const getWalletBalance = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }
    res.json({ balance: wallet.balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const topUpWallet = async (req, res) => {
  try {
    const { amount, method } = req.body;

    if (amount < 100) {
      return res.status(400).json({ message: 'Minimum top-up amount is 100 Taka' });
    }

    if (method === 'mobile') {
      return res.status(400).json({ message: 'Currently unavailable' });
    }

    // Create a temporary transaction record
    const transaction = await Transaction.create({
      userId: req.user._id,
      amount,
      transactionType: 'deposit',
      description: `Wallet top up via ${method}`,
      status: 'pending'
    });

    if (method === 'card') {
      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'bdt',
            product_data: {
              name: 'Wallet Top Up',
              description: 'Add funds to your EDU COIN wallet'
            },
            unit_amount: amount * 100 // Convert to cents
          },
          quantity: 1
        }],
        mode: 'payment',
        success_url: `${FRONTEND_URL}/payment/verify?success=true&transactionId=${transaction._id}`,
        cancel_url: `${FRONTEND_URL}/payment/verify?success=false&transactionId=${transaction._id}`,
        metadata: {
          transactionId: transaction._id.toString()
        }
      });

      // Update transaction with Stripe session ID
      transaction.stripePaymentId = session.id;
      await transaction.save();

      return res.json({
        success: true,
        sessionUrl: session.url
      });
    }

    // For bank transfers (handled differently)
    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    wallet.balance += Number(amount);
    wallet.lastUpdated = Date.now();
    await wallet.save();

    // Update transaction status
    transaction.status = 'completed';
    await transaction.save();
    
    // Create notification
    await createNotification({
      userId: req.user._id,
      title: 'Wallet Top-up Successful',
      message: `Your wallet has been topped up with ৳${amount}.`,
      type: 'topup'
    });

    // Update achievements after successful top-up
    await updateAchievements(req.user._id);

    res.json({
      success: true,
      message: 'Top-up successful',
      balance: wallet.balance
    });
  } catch (error) {
    console.error('Top up error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { transactionId, success } = req.body;

    // Find the transaction and ensure it's pending
    const transaction = await Transaction.findOne({ 
      _id: transactionId,
      status: 'pending'
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found or already processed' });
    }

    if (success === 'true') {
      // Verify the payment with Stripe
      if (transaction.stripePaymentId) {
        const session = await stripe.checkout.sessions.retrieve(transaction.stripePaymentId);
        if (session.payment_status !== 'paid') {
          transaction.status = 'failed';
          await transaction.save();
          return res.json({ success: false, message: 'Payment verification failed' });
        }
      }

      // Update wallet balance
      const wallet = await Wallet.findOne({ userId: transaction.userId });
      if (!wallet) {
        return res.status(404).json({ message: 'Wallet not found' });
      }

      wallet.balance += transaction.amount;
      wallet.lastUpdated = Date.now();
      await wallet.save();

      // Mark transaction as completed
      transaction.status = 'completed';
      await transaction.save();

      // Update achievements after successful payment verification
      await updateAchievements(transaction.userId);

      res.json({ 
        success: true, 
        message: 'Payment verified successfully',
        balance: wallet.balance
      });
    } else {
      // Mark transaction as failed
      transaction.status = 'failed';
      await transaction.save();
      
      res.json({ 
        success: false, 
        message: 'Payment was cancelled or failed' 
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: error.message });
  }
};