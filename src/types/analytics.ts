export interface Analytics {
    totalUsers: number;
    totalTransactions: number;
    totalVolume: number;
    averageTransaction: number;
    transactionTrends: {
      date: string;
      count: number;
    }[];
    userActivity: {
      hour: number;
      count: number;
    }[];
    categoryDistribution: {
      [key: string]: number;
    };
    recentActivity: {
      description: string;
      amount: number;
      type: 'deposit' | 'purchase';
      timestamp: string;
      user: {
        name: string;
        studentId: string;
        email: string;
      };
    }[];
  }