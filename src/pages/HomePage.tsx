import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { WalletCard } from '../components/wallet/WalletCard';
import { QuickActions } from '../components/dashboard/QuickActions';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { FloatingChatbot } from '../components/chat/FloatingChatbot';
import { RankBadge } from '../components/achievements/RankBadge';
import { useAuth } from '../context/AuthContext';
import { getGreeting } from '../utils/dateTime';
import { getWalletBalance } from '../services/wallet';
import { getTransactionHistory } from '../services/transactions';
import { getUserAchievements } from '../services/achievements';
import type { Transaction } from '../types/transaction';
import type { UserRank } from '../types/achievements';

export const HomePage = () => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rank, setRank] = useState<UserRank | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [balanceResponse, transactionsResponse, achievementsResponse] = await Promise.all([
          getWalletBalance(),
          getTransactionHistory(),
          getUserAchievements()
        ]);
        setBalance(balanceResponse.balance);
        setTransactions(transactionsResponse);
        setRank(achievementsResponse.rank);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?._id) {
      fetchData();
    }
  }, [user?._id]);

  if (!user) {
    return null;
  }

  const rankProgress = rank ? (rank.points / rank.nextTierPoints) * 100 : 0;

  return (
    <div className="h-screen flex flex-col bg-[#F5F5F5]">
      <Header username={user.username} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-[#2C3E50] tracking-wide">
              {getGreeting()}, {user.username}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="space-y-8">
                  <div className="flex items-center gap-8">
                    <WalletCard 
                      balance={balance}
                      isLoading={isLoading}
                    />
                    {rank && (
                      <div className="flex-1 bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <RankBadge 
                            tier={rank.tier} 
                            size="lg" 
                            progress={rankProgress}
                          />
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Current Points</p>
                            <p className="text-2xl font-bold text-[#2C3E50]">{rank.points}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Next Rank</span>
                            <span className="font-medium text-[#2C3E50]">
                              {rank.points} / {rank.nextTierPoints}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <QuickActions />
                  <RecentTransactions transactions={transactions} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <FloatingChatbot />
    </div>
  );
};