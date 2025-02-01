import api from './api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  studentId: string;
  email: string;
  username: string;
  password: string;
  pin: string;
}

interface VerifyCredentialsData {
  studentId: string;
  pin: string;
}

export const login = async (credentials: LoginCredentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const register = async (data: RegisterData) => {
  try {
    const response = await api.post('/auth/register', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const verifyUserCredentials = async (data: VerifyCredentialsData) => {
  try {
    const response = await api.post('/auth/verify-credentials', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Verification failed');
  }
};

export const resetPassword = async (token: string, password: string) => {
  try {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Password reset failed');
  }
};