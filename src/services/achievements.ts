import api from './api';
import type { Achievement, UserRank } from '../types/achievements';

export const getUserAchievements = async (): Promise<{
  achievements: Achievement[];
  rank: UserRank;
}> => {
  try {
    const response = await api.get('/achievements');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch achievements');
  }
};