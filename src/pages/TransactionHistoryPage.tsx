import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { TransactionHistory } from '../components/transactions/transactionHistory';
import { useAuth } from '../context/AuthContext';

export const TransactionHistoryPage = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="h-screen flex flex-col bg-[#F5F5F5]">
      <Header username={user.username} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <TransactionHistory />
        </main>
      </div>
    </div>
  );
};