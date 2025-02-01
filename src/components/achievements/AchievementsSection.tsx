import { useState } from 'react';
import { Trophy } from 'lucide-react';
import { RankBadge } from './RankBadge';
import { AchievementCard } from './AchievementsCard';
import type { Achievement, UserRank } from '../../types/achievements';

interface AchievementsSectionProps {
  achievements: Achievement[];
  rank: UserRank;
}

export const AchievementsSection = ({ achievements, rank }: AchievementsSectionProps) => {
  const [filter, setFilter] = useState<'all' | 'completed' | 'in-progress'>('all');
  
  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'completed') return achievement.isCompleted;
    if (filter === 'in-progress') return !achievement.isCompleted;
    return true;
  });

  const progress = (rank.points / rank.nextTierPoints) * 100;

  return (
    <div className="space-y-8">
      {/* Rank Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="h-8 w-8 text-[#2C3E50]" />
          <h2 className="text-2xl font-bold text-[#2C3E50]">Your Rank</h2>
        </div>

        <div className="flex items-center gap-8">
          <RankBadge tier={rank.tier} size="lg" />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Progress to next rank</span>
              <span className="text-sm font-medium text-[#2C3E50]">
                {rank.points} / {rank.nextTierPoints} points
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#2C3E50] to-[#3D5166] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-[#2C3E50]">Achievements</h3>
          <div className="flex gap-2">
            {(['all', 'completed', 'in-progress'] as const).map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors
                  ${filter === option
                    ? 'bg-[#2C3E50] text-white'
                    : 'text-[#2C3E50] hover:bg-gray-100'
                  }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAchievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </div>
    </div>
  );
};