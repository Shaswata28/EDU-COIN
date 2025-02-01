import api from './api';
import type { PaymentMethod } from '../types/payment';

export const getWalletBalance = async () => {
  const response = await api.get('/wallet/balance');
  return response.data;
};

export const topUpWallet = async (amount: number, method: PaymentMethod) => {
  const response = await api.post('/wallet/topup', { amount, method });
  return response.data;
};

export const verifyPayment = async (transactionId: string, success: string) => {
  const response = await api.post('/wallet/verify-payment', { transactionId, success });
  return response.data;
};