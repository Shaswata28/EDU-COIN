import api from './api';
import type { Analytics } from '../types/analytics';

export const getAllUsers = async () => {
  try {
    const response = await api.get('/admin/users');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch users');
  }
};

export const searchUser = async (studentId: string) => {
  try {
    console.log('Sending request to:', `/admin/users/${studentId}`);
    const response = await api.get(`/admin/users/${studentId}`);
    console.log('Response received:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('API Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'User not found');
  }
};

export const updateUser = async (id: string, userData: {
  firstName: string;
  lastName: string;
}) => {
  try {
    const response = await api.put(`/admin/users/${id}`, userData);
    if (!response.data.success && !response.data.user) {
      throw new Error(response.data.message || 'Failed to update user');
    }
    return response.data;
  } catch (error: any) {
    console.error('Update user error:', error);
    throw new Error(error.response?.data?.message || 'Failed to update user');
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete user');
  }
};

export const getAnalytics = async (): Promise<Analytics> => {
  try {
    const response = await api.get('/admin/analytics');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch analytics');
  }
};