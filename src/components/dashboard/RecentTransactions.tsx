import { History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Transaction } from '../../types/transaction';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export const RecentTransactions = ({ transactions }: RecentTransactionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="animate-slideInRight bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-[#2C3E50]" />
          <h3 className="text-lg font-semibold text-[#2C3E50]">Recent Transactions</h3>
        </div>
        <button
          onClick={() => navigate('/history')}
          className="text-sm text-[#2C3E50] hover:underline hover-lift"
        >
          View All
        </button>
      </div>

      <div className="space-y-4 stagger-animate">
        {transactions.length > 0 ? (
          transactions.slice(0, 5).map((transaction) => (
            <div
              key={transaction.transactionId}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover-scale"
            >
              <div>
                <p className="font-medium text-[#2C3E50]">
                  {transaction.description}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(transaction.transactionDate).toLocaleDateString()}
                </p>
              </div>
              <span className={`font-medium ${
                transaction.transactionType === 'deposit'
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {transaction.transactionType === 'deposit' ? '+' : '-'}
                ৳{transaction.amount.toFixed(2)}
              </span>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No recent transactions</p>
        )}
      </div>
    </div>
  );
};