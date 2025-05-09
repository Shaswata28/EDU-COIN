import { Trophy, Star, Zap, Wallet, CreditCard, Award } from 'lucide-react';
import type { Achievement } from '../../types/achievements';
import { useState, useEffect } from 'react';

interface AchievementCardProps {
  achievement: Achievement;
}

export const AchievementCard = ({ achievement }: AchievementCardProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const progress = (achievement.progress / achievement.maxProgress) * 100;

  // Check if the device is mobile on mount and when window resizes
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getIcon = () => {
    switch (achievement.icon) {
      case 'trophy': return <Trophy className="h-5 w-5 sm:h-6 sm:w-6" />;
      case 'star': return <Star className="h-5 w-5 sm:h-6 sm:w-6" />;
      case 'zap': return <Zap className="h-5 w-5 sm:h-6 sm:w-6" />;
      case 'wallet': return <Wallet className="h-5 w-5 sm:h-6 sm:w-6" />;
      case 'credit-card': return <CreditCard className="h-5 w-5 sm:h-6 sm:w-6" />;
      default: return <Award className="h-5 w-5 sm:h-6 sm:w-6" />;
    }
  };

  return (
    <div 
      className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 
        ${isMobile ? '' : 'hover-lift'} 
        ${achievement.isCompleted 
          ? 'border-green-500 bg-green-50' 
          : 'border-gray-200 hover:border-[#2C3E50]'}`}
    >
      <div className="flex items-start gap-2 sm:gap-4">
        <div className={`p-2 sm:p-3 rounded-lg ${
          achievement.isCompleted ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
        }`}>
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm sm:text-base text-[#2C3E50] mb-0.5 sm:mb-1 truncate">{achievement.title}</h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">{achievement.description}</p>
          <div className="relative h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500
                ${achievement.isCompleted ? 'bg-green-500' : 'bg-[#2C3E50]'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-1">
            <p className="text-2xs sm:text-xs text-gray-500">
              {achievement.progress} / {achievement.maxProgress}
            </p>
            {achievement.isCompleted && 
              <span className="text-2xs sm:text-xs text-green-500 font-medium">Completed!</span>
            }
          </div>
        </div>
      </div>
    </div>
  );
};
