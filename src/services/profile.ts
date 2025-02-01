import api from './api';

export interface ProfileUpdateData {
  firstName: string;
  lastName: string;
}

export interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
  pin: string;
}

export const updateProfile = async (data: ProfileUpdateData) => {
  const response = await api.put('/profile', data);
  return response.data;
};

export const updatePassword = async (data: PasswordUpdateData) => {
  const response = await api.put('/profile/password', data);
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get('/profile');
  return response.data;
};