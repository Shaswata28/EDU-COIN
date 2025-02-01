import { useState, useEffect } from 'react';
import { getWalletBalance, topUpWallet } from '../services/wallet';
import type { PaymentMethod } from '../types/payment';

export const useWallet = () => {
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBalance = async () => {
    try {
      const response = await getWalletBalance();
      setBalance(response.balance);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const topUp = async (amount: number, method: PaymentMethod) => {
    const response = await topUpWallet(amount, method);
    
    // Only update balance immediately for bank transfers
    // For card payments, balance will be updated after Stripe verification
    if (method !== 'card' && response.balance) {
      setBalance(response.balance);
    }
    
    return response;
  };

  return {
    balance,
    isLoading,
    topUp,
    refreshBalance: fetchBalance,
  };
};