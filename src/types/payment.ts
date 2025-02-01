export type PaymentMethod = 'bank' | 'card' | 'mobile';

export interface PaymentData {
  category: string;
  amount: number;
  description?: string;
  pin: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  transactionId?: string;
}

export interface TopUpResponse {
  success: boolean;
  message: string;
  balance: number;
  transactionId?: string;
}