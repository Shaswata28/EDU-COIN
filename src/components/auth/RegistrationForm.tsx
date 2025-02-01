import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Coins, Eye, EyeOff } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { SuccessPopup } from '../common/SuccessPopup';
import { PasswordStrengthIndicator } from '../common/PasswordStrengthIndicator';
import { validatePassword, validateEmail, validatePin } from '../../utils/validation';
import { register } from '../../services/auth';

interface RegistrationFormData {
  firstName: string;
  lastName: string;
  studentId: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  pin: string;
  confirmPin: string;
}

export const RegistrationForm = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<RegistrationFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [formData, setFormData] = useState<RegistrationFormData>({
    firstName: '',
    lastName: '',
    studentId: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    pin: '',
    confirmPin: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setServerError('');
  };

  const validateForm = () => {
    const newErrors: Partial<RegistrationFormData> = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.studentId) newErrors.studentId = 'Student ID is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email must be from @eastdelta.edu.bd domain';
    }
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with one uppercase, one number, and one special character';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.pin) {
      newErrors.pin = 'PIN is required';
    } else if (!validatePin(formData.pin)) {
      newErrors.pin = 'PIN must be exactly 5 digits';
    }
    if (formData.pin !== formData.confirmPin) {
      newErrors.confirmPin = 'PINs do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setServerError('');

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        studentId: formData.studentId,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        pin: formData.pin,
      });

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/login');
      }, 2000);
    } catch (error) {
      if (error instanceof Error) {
        setServerError(error.message);
      } else if (typeof error === 'object' && error && 'message' in error) {
        setServerError(error.message as string);
      } else {
        setServerError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8 animate-slideInUp">
        <div className="flex justify-center items-center gap-2 mb-6 hover-lift animate-fadeIn">
          <Coins className="h-12 w-12 text-[#FFD700]" />
          <h1 className="text-3xl font-bold text-[#2C3E50]">EDU COIN</h1>
        </div>
        
        {serverError && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded animate-shake">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-[#2C3E50] font-semibold mb-4 animate-fadeIn">Personal Information</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-animate">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              disabled={isLoading}
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              disabled={isLoading}
            />
            <Input
              label="Student ID"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              error={errors.studentId}
              disabled={isLoading}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="example@eastdelta.edu.bd"
              disabled={isLoading}
            />
          </div>

          <div className="text-[#2C3E50] font-semibold mb-4 animate-fadeIn">Login Credentials</div>
          <div className="space-y-4 stagger-animate">
            <Input
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              disabled={isLoading}
            />
            <div className="relative">
              <Input
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            <PasswordStrengthIndicator password={formData.password} />
            
            <div className="relative">
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="text-[#2C3E50] font-semibold mb-4">Payment PIN</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Input
                label="5-Digit PIN"
                name="pin"
                type={showPin ? "text" : "password"}
                maxLength={5}
                value={formData.pin}
                onChange={handleChange}
                error={errors.pin}
                placeholder="Enter 5-digit PIN"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
              >
                {showPin ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <div className="relative">
              <Input
                label="Confirm PIN"
                name="confirmPin"
                type={showConfirmPin ? "text" : "password"}
                maxLength={5}
                value={formData.confirmPin}
                onChange={handleChange}
                error={errors.confirmPin}
                placeholder="Confirm 5-digit PIN"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPin(!showConfirmPin)}
                className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
              >
                {showConfirmPin ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Registering...' : 'Register'}
            </Button>
          </div>

          <div className="text-center text-sm">
            Already have an account?{' '}
            <a href="/login" className="text-[#2C3E50] hover:text-[#1A2533] transition-colors">
              Login here
            </a>
          </div>
        </form>
      </div>
      {showSuccess && <SuccessPopup message="Registration successful! Redirecting to login..." />}
    </div>
  );
};