import { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { AchievementsSection } from '../components/achievements/AchievementsSection';
import { useAuth } from '../context/AuthContext';
import { getUserAchievements } from '../services/achievements';
import type { Achievement, UserRank } from '../types/achievements';

export const AchievementsPage = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [rank, setRank] = useState<UserRank | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const data = await getUserAchievements();
        setAchievements(data.achievements);
        setRank(data.rank);
      } catch (err) {
        console.error('Failed to fetch achievements:', err);
        setError('Failed to load achievements');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col bg-[#F5F5F5]">
        <Header username={user.username} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 p-8 overflow-y-auto flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C3E50]"></div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !rank) {
    return (
      <div className="h-screen flex flex-col bg-[#F5F5F5]">
        <Header username={user.username} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 p-8 overflow-y-auto flex items-center justify-center">
            <div className="text-red-500">{error || 'Failed to load achievements'}</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#F5F5F5]">
      <Header username={user.username} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <AchievementsSection achievements={achievements} rank={rank} />
        </main>
      </div>
    </div>
  );
};