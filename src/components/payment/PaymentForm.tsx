import { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { Button } from '../common/Button';
import { PaymentCategory } from './PaymentCategory';
import { PinVerificationModal } from '../common/PinVerificationModal';
import { Receipt } from './Receipt';
import { processPayment } from '../../services/payment';
import type { PaymentData } from '../../types/payment';

interface PaymentCategoryProps {
  category: string;
  isSelected: boolean;
  onClick: () => void;
}

const PAYMENT_CATEGORIES = ['Canteen', 'Library', 'Lab', 'Club'] as const;

export const PaymentForm = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleProceed = () => {
    if (!selectedCategory) {
      setError('Please select a payment category');
      return;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    setError('');
    setShowPinModal(true);
  };

  const PaymentCategory = ({ category, isSelected, onClick }: PaymentCategoryProps) => {
    return (
      <button
        onClick={onClick}
        className={`p-4 rounded-lg border-2 transition-all duration-300 text-center hover-lift
          ${isSelected 
            ? 'border-[#2C3E50] bg-[#2C3E50] text-white scale-105' 
            : 'border-gray-200 hover:border-[#2C3E50] text-gray-600 hover:text-[#2C3E50]'
          }`}
      >
        <span className="font-medium">{category}</span>
      </button>
    );
  };

  const handlePayment = async (pin: string) => {
    setIsLoading(true);
    try {
      const paymentData: PaymentData = {
        category: selectedCategory.toLowerCase(),
        amount: Number(amount),
        description,
        pin
      };
      const response = await processPayment(paymentData);
      if (response.success) {
        setReceiptData({
          transactionId: response.transactionId,
          amount: Number(amount),
          category: selectedCategory,
          description,
          date: new Date().toISOString()
        });
        setShowPinModal(false);
        setShowReceipt(true);
        // Reset form
        setSelectedCategory('');
        setAmount('');
        setDescription('');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="animate-fadeIn bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center gap-3 mb-8">
          <CreditCard className="h-8 w-8 text-[#2C3E50]" />
          <h2 className="text-2xl font-bold text-[#2C3E50]">Make Payment</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-[#2C3E50] font-medium mb-4">
              Choose payment option:
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {PAYMENT_CATEGORIES.map((category) => (
                <PaymentCategory
                  key={category}
                  category={category}
                  isSelected={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[#2C3E50] font-medium mb-2">
              Payment amount:
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">৳</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2C3E50] focus:border-transparent"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#2C3E50] font-medium mb-2">
              Payment description (optional):
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2C3E50] focus:border-transparent"
              rows={3}
              placeholder="Enter payment details..."
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <Button
            onClick={handleProceed}
            disabled={isLoading}
            fullWidth
          >
            {isLoading ? 'Processing...' : 'Proceed'}
          </Button>
        </div>
      </div>

      {showPinModal && (
        <PinVerificationModal
          onVerify={handlePayment}
          onClose={() => setShowPinModal(false)}
        />
      )}

      {showReceipt && receiptData && (
        <Receipt
          {...receiptData}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
};
