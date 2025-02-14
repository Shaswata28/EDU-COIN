import api from './api';
import type { PaymentData } from '../types/payment';

export const processPayment = async (paymentData: PaymentData) => {
  try {
    const response = await api.post('/payment', paymentData);
    try {
      await api.post('/notifications', {
        title: 'Payment Successful',
        message: `Payment of ৳${paymentData.amount} for ${paymentData.category} was successful.`,
        type: 'payment'
      });
    } catch (error) {
      console.error('Failed to create payment notification:', error);
    }
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Payment failed';
    throw new Error(errorMessage);
  }
};