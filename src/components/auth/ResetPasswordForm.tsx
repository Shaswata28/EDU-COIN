import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { PasswordStrengthIndicator } from '../common/PasswordStrengthIndicator';
import { validatePassword } from '../../utils/validation';
import { resetPassword } from '../../services/auth';

export const ResetPasswordForm = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword(formData.password)) {
      setError('Password must meet all requirements');
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await resetPassword(token!, formData.password);
      setShowSuccess(true);
      // Add a slight delay before redirecting to make the success message visible
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError('Failed to reset password. Please try again.');
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
            <Lock className="h-12 w-12 text-[#2C3E50]" />
          </div>
          <h1 className="text-2xl font-bold text-[#2C3E50] mb-2">Set New Password</h1>
          <p className="text-gray-600">Please enter your new password below.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4 stagger-animate">
            <div className="relative">
              <Input
                label="New Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, password: e.target.value }));
                  setError('');
                }}
                placeholder="Enter new password"
                error={error}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            
            <PasswordStrengthIndicator password={formData.password} />

            <div className="relative">
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, confirmPassword: e.target.value }));
                  setError('');
                }}
                placeholder="Confirm new password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>

        {showSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center animate-fadeIn">
            <div className="bg-white rounded-lg p-6 shadow-xl flex flex-col items-center gap-4 animate-slideInUp">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Lock className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-[#2C3E50]">Password Reset Successful!</h3>
              <p className="text-gray-600">Redirecting to login...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};