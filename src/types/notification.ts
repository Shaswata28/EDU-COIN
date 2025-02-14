export interface Notification {
    _id: string;
    title: string;
    message: string;
    type: 'payment' | 'topup' | 'achievement' | 'message' | 'budget' | 'system';
    read: boolean;
    createdAt: string;
  }