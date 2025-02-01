import { Trophy, Star, Zap, Wallet, CreditCard, Award } from 'lucide-react';
import type { Achievement } from '../../types/achievements';

interface AchievementCardProps {
  achievement: Achievement;
}

export const AchievementCard = ({ achievement }: AchievementCardProps) => {
  const progress = (achievement.progress / achievement.maxProgress) * 100;

  const getIcon = () => {
    switch (achievement.icon) {
      case 'trophy': return <Trophy className="h-6 w-6" />;
      case 'star': return <Star className="h-6 w-6" />;
      case 'zap': return <Zap className="h-6 w-6" />;
      case 'wallet': return <Wallet className="h-6 w-6" />;
      case 'credit-card': return <CreditCard className="h-6 w-6" />;
      default: return <Award className="h-6 w-6" />;
    }
  };

  return (
    <div className={`p-4 rounded-lg border-2 transition-all duration-300 hover-lift
      ${achievement.isCompleted 
        ? 'border-green-500 bg-green-50' 
        : 'border-gray-200 hover:border-[#2C3E50]'}`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${
          achievement.isCompleted ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
        }`}>
          {getIcon()}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-[#2C3E50] mb-1">{achievement.title}</h3>
          <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500
                ${achievement.isCompleted ? 'bg-green-500' : 'bg-[#2C3E50]'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {achievement.progress} / {achievement.maxProgress}
            {achievement.isCompleted && ' • Completed!'}
          </p>
        </div>
      </div>
    </div>
  );
};