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
    <div className="bg-[#2C3E50] text-white p-8 rounded-xl shadow-lg max-w-sm w-full transform hover:scale-105 transition-transform duration-300">
      <div className="flex flex-col items-center space-y-6">
        <Wallet className="h-20 w-20 text-[#FFD700]" />
        <div className="text-center">
          <p className="text-sm text-gray-300 mb-2">Current Balance</p>
          {isLoading ? (
            <div className="h-10 w-32 bg-gray-700 animate-pulse rounded"></div>
          ) : (
            <p className="text-4xl font-bold text-[#FFD700]">৳{balance.toFixed(2)}</p>
          )}
        </div>
        <Button
          onClick={() => navigate('/topup')}
          disabled={isLoading}
          className="w-32 bg-[#FFD700] hover:bg-[#F4C430] text-[#2C3E50] transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Top Up
        </Button>
      </div>
    </div>
  );
};