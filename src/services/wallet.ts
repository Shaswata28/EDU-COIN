import api from './api';
import type { PaymentMethod } from '../types/payment';

export const getWalletBalance = async () => {
  const response = await api.get('/wallet/balance');
  return response.data;
};

export const topUpWallet = async (amount: number, method: PaymentMethod) => {
  const response = await api.post('/wallet/topup', { amount, method });
  
  // Create notification for successful top-up
  if (response.data.success) {
    try {
      await api.post('/notifications', {
        title: 'Wallet Top-up Successful',
        message: `Your wallet has been topped up with ৳${amount}.`,
        type: 'topup'
      });
    } catch (error) {
      console.error('Failed to create top-up notification:', error);
    }
  }
  
  return response.data;
};

export const verifyPayment = async (transactionId: string, success: string) => {
  const response = await api.post('/wallet/verify-payment', { transactionId, success });
  
  // Create notification for verified payment
  if (response.data.success) {
    try {
      await api.post('/notifications', {
        title: 'Payment Verification Successful',
        message: 'Your payment has been verified and your wallet has been updated.',
        type: 'topup'
      });
    } catch (error) {
      console.error('Failed to create verification notification:', error);
    }
  }
  
  return response.data;
};