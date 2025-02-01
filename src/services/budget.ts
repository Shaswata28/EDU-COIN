import api from './api';

export const updateBudget = async (category: string, amount: number) => {
  try {
    const response = await api.put('/budget', { category, amount });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update budget');
  }
};

export const getBudgets = async () => {
  try {
    const response = await api.get('/budget');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch budgets');
  }
};