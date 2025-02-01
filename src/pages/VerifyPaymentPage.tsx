import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { verifyPayment } from '../services/wallet';
import { useWallet } from '../hooks/useWallet';

export const VerifyPaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState('');
  const { refreshBalance } = useWallet();

  useEffect(() => {
    const verifyTransaction = async () => {
      try {
        // Restore auth token from sessionStorage
        const storedToken = sessionStorage.getItem('stripe_auth_token');
        if (storedToken) {
          localStorage.setItem('token', storedToken);
          sessionStorage.removeItem('stripe_auth_token');
        }

        const success = searchParams.get('success');
        const transactionId = searchParams.get('transactionId');

        if (!transactionId) {
          setError('Invalid transaction');
          setIsVerifying(false);
          return;
        }

        const response = await verifyPayment(transactionId, success || 'false');
        
        // Refresh wallet balance after successful payment
        if (response.success) {
          await refreshBalance();
        }
        
        // Redirect after short delay
        setTimeout(() => {
          navigate('/topup');
        }, 2000);
      } catch (err) {
        setError('Failed to verify payment');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyTransaction();
  }, [searchParams, navigate, refreshBalance]);

  const success = searchParams.get('success') === 'true';

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {isVerifying ? (
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C3E50]"></div>
            <p className="text-lg text-gray-600">Verifying payment...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-4">
            <XCircle className="h-16 w-16 text-red-500" />
            <p className="text-lg text-red-500">{error}</p>
          </div>
        ) : success ? (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <h2 className="text-2xl font-bold text-[#2C3E50]">Payment Successful!</h2>
            <p className="text-gray-600">Your wallet has been topped up.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <XCircle className="h-16 w-16 text-red-500" />
            <h2 className="text-2xl font-bold text-[#2C3E50]">Payment Failed</h2>
            <p className="text-gray-600">Your payment was not successful.</p>
          </div>
        )}
      </div>
    </div>
  );
};