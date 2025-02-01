import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Building2, CreditCard, Smartphone } from 'lucide-react';
import { PaymentMethod } from '../../types/payment';
import { useWallet } from '../../hooks/useWallet';
import { PaymentButton } from './PaymentButton';
import { SuccessModal } from '../common/SuccessModal';
import { ErrorModal } from '../common/ErrorModal';

export const TopUpForm = () => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { balance, topUp } = useWallet();
  const navigate = useNavigate();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    if (Number(value) < 100) {
      setError('Minimum top-up amount is 100 Taka');
    } else {
      setError('');
    }
  };

  const handlePayment = async (method: PaymentMethod) => {
    if (method === 'mobile') {
      setErrorMessage('Currently unavailable');
      setShowError(true);
      return;
    }

    if (!amount || Number(amount) < 100) {
      setError('Minimum top-up amount is 100 Taka');
      return;
    }

    try {
      const response = await topUp(Number(amount), method);
      
      if (response.success && response.sessionUrl) {
        // Store auth token before redirect
        const token = localStorage.getItem('token');
        sessionStorage.setItem('stripe_auth_token', token || '');
        
        // Redirect to Stripe checkout
        window.location.href = response.sessionUrl;
      } else {
        // For bank transfers
        setShowSuccess(true);
        setAmount('');
      }
    } catch (err) {
      setErrorMessage('Payment failed. Please try again.');
      setShowError(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="animate-fadeIn bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center gap-3 mb-8">
          <Wallet className="h-8 w-8 text-[#2C3E50]" />
          <h2 className="text-2xl font-bold text-[#2C3E50]">Top Up Wallet</h2>
        </div>

        <div className="mb-8 animate-slideInRight">
          <p className="text-gray-600 mb-2">Current Balance</p>
          <p className="text-3xl font-bold text-[#2C3E50]">৳{balance.toFixed(2)}</p>
        </div>

        <div className="mb-8 animate-slideInLeft">
          <label className="block text-gray-600 mb-2">Enter amount:</label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">৳</span>
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2C3E50] focus:border-transparent"
              placeholder="Enter amount"
              min="100"
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <div className="animate-slideInRight">
          <p className="text-gray-600 mb-4">Proceed with:</p>
          <div className="grid grid-cols-3 gap-4 stagger-animate">
            <PaymentButton
              icon={<Building2 className="h-6 w-6" />}
              label="Bank"
              onClick={() => handlePayment('bank')}
            />
            <PaymentButton
              icon={<CreditCard className="h-6 w-6" />}
              label="Card"
              onClick={() => handlePayment('card')}
            />
            <PaymentButton
              icon={<Smartphone className="h-6 w-6" />}
              label="Mobile Banking"
              onClick={() => handlePayment('mobile')}
            />
          </div>
        </div>
      </div>

      <SuccessModal
        show={showSuccess}
        message="Top-up successful!"
        onClose={() => setShowSuccess(false)}
      />

      <ErrorModal
        show={showError}
        message={errorMessage}
        onClose={() => setShowError(false)}
      />
    </div>
  );
};