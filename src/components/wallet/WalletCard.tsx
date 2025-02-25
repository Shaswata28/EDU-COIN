import { Wallet } from 'lucide-react';
import { Button } from '../common/Button';
import { useNavigate } from 'react-router-dom';

interface WalletCardProps {
  balance: number;
  isLoading?: boolean;
}

export const WalletCard = ({ balance, isLoading = false }: WalletCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#2C3E50] text-white p-6 md:p-8 rounded-xl shadow-lg w-full md:max-w-sm">
      <div className="flex flex-col items-center space-y-4 md:space-y-6">
        <Wallet className="h-16 w-16 md:h-20 md:w-20 text-[#FFD700]" />
        <div className="text-center">
          <p className="text-xs md:text-sm text-gray-300 mb-2">Current Balance</p>
          {isLoading ? (
            <div className="h-8 md:h-10 w-24 md:w-32 bg-gray-700 animate-pulse rounded"></div>
          ) : (
            <p className="text-2xl md:text-4xl font-bold text-[#FFD700]">৳{balance.toFixed(2)}</p>
          )}
        </div>
        <Button
          onClick={() => navigate('/topup')}
          disabled={isLoading}
          className="w-full md:w-32 bg-[#FFD700] hover:bg-[#F4C430] text-[#2C3E50] text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Top Up
        </Button>
      </div>
    </div>
  );
};