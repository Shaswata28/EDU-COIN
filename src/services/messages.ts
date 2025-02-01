import api from './api';
import type { Message } from '../types/message';

export const sendMessage = async (data: { subject: string; message: string }) => {
  const response = await api.post('/messages', data);
  return response.data;
};

export const getMessages = async (): Promise<Message[]> => {
  const response = await api.get('/messages');
  return response.data;
};

export const markAsRead = async (messageId: string) => {
  const response = await api.put(`/messages/${messageId}/read`);
  return response.data;
};

export const deleteMessage = async (messageId: string) => {
  const response = await api.delete(`/messages/${messageId}`);
  return response.data;
};