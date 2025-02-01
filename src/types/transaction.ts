export interface Transaction {
    transactionId: string;
    userId: string;
    amount: number;
    transactionType: 'deposit' | 'purchase';
    category?: string;
    description: string;
    transactionDate: string;
  }