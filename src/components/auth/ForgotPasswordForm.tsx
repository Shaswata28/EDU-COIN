import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, CreditCard, Eye, EyeOff } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { verifyUserCredentials } from '../../services/auth';

export const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentId: '',
    pin: ''
  });
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId || !formData.pin) {
      setError('All fields are required');
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await verifyUserCredentials({
        studentId: formData.studentId,
        pin: formData.pin
      });
      if (response.success) {
        navigate(`/reset-password/${response.token}`);
      }
    } catch (err) {
      setError('Invalid student ID or PIN combination');
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
      <div className={`w-full max-w-md bg-white rounded-lg shadow-lg p-8 animate-slideInUp ${shake ? 'animate-shake' : ''}`}>
        <div className="text-center mb-8 animate-fadeIn">
          <div className="flex justify-center mb-4 hover-lift">
            <KeyRound className="h-12 w-12 text-[#2C3E50]" />
          </div>
          <h1 className="text-2xl font-bold text-[#2C3E50] mb-2">Reset Password</h1>
          <p className="text-gray-600">Enter your student ID and PIN to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4 stagger-animate">
            <Input
              label="Student ID"
              value={formData.studentId}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, studentId: e.target.value }));
                setError('');
              }}
              placeholder="Enter your student ID"
              error={error}
              disabled={isLoading}
              startAdornment={<CreditCard className="h-5 w-5 text-gray-400" />}
            />

            <div className="relative">
              <Input
                label="PIN"
                type={showPin ? "text" : "password"}
                value={formData.pin}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, pin: e.target.value }));
                  setError('');
                }}
                placeholder="Enter your 5-digit PIN"
                maxLength={5}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPin ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Continue'}
          </Button>

          <div className="text-center animate-fadeIn">
            <a 
              href="/login"
              className="text-[#2C3E50] hover:text-[#1A2533] transition-colors"
            >
              Back to Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};