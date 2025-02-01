import { Crown, Award, Shield, Diamond, Medal } from 'lucide-react';
import type { RankTier } from '../../types/achievements';

interface RankBadgeProps {
  tier: RankTier;
  size?: 'sm' | 'md' | 'lg';
  progress?: number;
}

const RANK_COLORS = {
  bronze: 'from-orange-400 to-orange-600',
  silver: 'from-gray-300 to-gray-500',
  gold: 'from-yellow-300 to-yellow-500',
  platinum: 'from-blue-300 to-blue-500',
  diamond: 'from-purple-300 to-purple-500',
};

const RANK_ICONS = {
  bronze: Medal,
  silver: Shield,
  gold: Crown,
  platinum: Award,
  diamond: Diamond,
};

export const RankBadge = ({ tier, size = 'md', progress }: RankBadgeProps) => {
  const Icon = RANK_ICONS[tier];
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-12 w-12 text-sm',
    lg: 'h-16 w-16 text-base',
  };

  const circleSize = size === 'lg' ? 80 : size === 'md' ? 60 : 40;
  const strokeWidth = size === 'lg' ? 4 : 3;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = progress !== undefined 
    ? circumference - (progress / 100) * circumference 
    : 0;

  return (
    <div className="relative inline-flex flex-col items-center animate-fadeIn">
      <div className="relative">
        {progress !== undefined && (
          <svg
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 animate-spin-slow"
            width={circleSize}
            height={circleSize}
          >
            <circle
              className="text-gray-200"
              strokeWidth={strokeWidth}
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx={circleSize / 2}
              cy={circleSize / 2}
            />
            <circle
              className={`transition-all duration-1000 ease-out ${
                tier === 'bronze' ? 'text-orange-500' :
                tier === 'silver' ? 'text-gray-400' :
                tier === 'gold' ? 'text-yellow-400' :
                tier === 'platinum' ? 'text-blue-400' :
                'text-purple-400'
              }`}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={progressOffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx={circleSize / 2}
              cy={circleSize / 2}
            />
          </svg>
        )}
        <div className={`relative rounded-full bg-gradient-to-br ${RANK_COLORS[tier]} p-3 shadow-lg
          ${sizeClasses[size]} flex items-center justify-center hover:scale-105 transition-transform duration-300`}>
          <Icon className="text-white" />
        </div>
      </div>
      <span className={`mt-2 font-semibold text-[#2C3E50] capitalize ${
        size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
      }`}>
        {tier}
      </span>
    </div>
  );
};