import { useState, useEffect } from 'react';
import { History, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { getTransactionHistory } from '../../services/transactions';
import type { Transaction } from '../../types/transaction';

export const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getTransactionHistory();
        setTransactions(data);
      } catch (err) {
        setError('Failed to load transaction history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C3E50]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="animate-fadeIn bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center gap-3 mb-8">
          <History className="h-8 w-8 text-[#2C3E50]" />
          <h2 className="text-2xl font-bold text-[#2C3E50]">Transaction History</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 text-left text-sm font-semibold text-gray-600">Date</th>
                <th className="py-3 text-left text-sm font-semibold text-gray-600">Transaction ID</th>
                <th className="py-3 text-left text-sm font-semibold text-gray-600">Type</th>
                <th className="py-3 text-left text-sm font-semibold text-gray-600">Category</th>
                <th className="py-3 text-left text-sm font-semibold text-gray-600">Amount</th>
                <th className="py-3 text-left text-sm font-semibold text-gray-600">Description</th>
              </tr>
            </thead>
            <tbody className="stagger-animate">
              {transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <tr 
                    key={transaction.transactionId} 
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 hover-lift"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <td className="py-4 text-sm">
                      {new Date(transaction.transactionDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-sm font-mono">
                      {transaction.transactionId}
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                        ${transaction.transactionType === 'deposit' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'}`}>
                        {transaction.transactionType === 'deposit' 
                          ? <ArrowDownLeft className="h-3 w-3" />
                          : <ArrowUpRight className="h-3 w-3" />
                        }
                        {transaction.transactionType}
                      </span>
                    </td>
                    <td className="py-4 text-sm capitalize">
                      {transaction.category || '-'}
                    </td>
                    <td className="py-4 text-sm font-medium">
                      <span className={transaction.transactionType === 'deposit' ? 'text-green-600' : 'text-red-600'}>
                        {transaction.transactionType === 'deposit' ? '+' : '-'}
                        ${transaction.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-gray-600">
                      {transaction.description}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};