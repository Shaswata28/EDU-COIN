import api from './api';

export const getUserAnalytics = async (month: number, year: number) => {
  try {
    const response = await api.get('/analytics/user', {
      params: { month, year }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch analytics');
  }
};

export const exportTransactionsPDF = async (startDate: string, endDate: string) => {
  try {
    const response = await api.get('/analytics/export/pdf', {
      params: { startDate, endDate },
      responseType: 'blob'
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to export PDF');
  }
};

export const exportTransactionsExcel = async (startDate: string, endDate: string) => {
  try {
    const response = await api.get('/analytics/export/excel', {
      params: { startDate, endDate },
      responseType: 'blob'
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to export Excel');
  }
};