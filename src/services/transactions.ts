import api from './api';
import type { Transaction } from '../types/transaction';

export const getTransactionHistory = async (): Promise<Transaction[]> => {
  try {
    const response = await api.get('/transactions');
    return response.data;
  } catch (error: any) {
   // throw new Error(error.response?.data?.message || 'Failed to fetch transaction history');
   console.log(error);
   throw new Error(error.response?.data?.message );
  }
};