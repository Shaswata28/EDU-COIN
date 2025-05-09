import { useState, useEffect } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'completed') return achievement.isCompleted;
    if (filter === 'in-progress') return !achievement.isCompleted;
    return true;
  });

  const progress = (rank.points / rank.nextTierPoints) * 100;

  const filterOptions = ['all', 'completed', 'in-progress'] as const;

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Rank Section */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-[#2C3E50]" />
          <h2 className="text-xl sm:text-2xl font-bold text-[#2C3E50]">Your Rank</h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-8 gap-4">
          <div className="flex justify-center">
            <RankBadge tier={rank.tier} size={isMobile ? "md" : "lg"} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1 sm:mb-2">
              <span className="text-xs sm:text-sm text-gray-600">Progress to next rank</span>
              <span className="text-xs sm:text-sm font-medium text-[#2C3E50]">
                {rank.points} / {rank.nextTierPoints} points
              </span>
            </div>
            <div className="h-2 sm:h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#2C3E50] to-[#3D5166] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-[#2C3E50]">Achievements</h3>
          
          {/* Filter buttons in dropdown for mobile */}
          {isMobile ? (
            <div className="w-full">
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="w-full p-2 rounded-lg border border-gray-200 bg-white text-sm text-[#2C3E50] appearance-none"
              >
                {filterOptions.map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setFilter(option)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm transition-colors
                    ${filter === option
                      ? 'bg-[#2C3E50] text-white'
                      : 'text-[#2C3E50] hover:bg-gray-100'
                    }`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {filteredAchievements.length > 0 ? (
            filteredAchievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))
          ) : (
            <div className="py-8 text-center text-gray-500">
              No {filter !== 'all' ? filter : ''} achievements found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
