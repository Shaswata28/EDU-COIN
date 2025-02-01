import api from './api';
import type { PaymentData } from '../types/payment';

export const processPayment = async (paymentData: PaymentData) => {
  try {
    const response = await api.post('/payment', paymentData);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Payment failed';
    throw new Error(errorMessage);
  }
};