import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface PinVerificationModalProps {
  onVerify: (pin: string) => Promise<void>;
  onClose: () => void;
}

export const PinVerificationModal = ({ onVerify, onClose }: PinVerificationModalProps) => {
  const [pin, setPin] = useState(['', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError('');

    // Move to next input if value is entered
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const fullPin = pin.join('');
    if (fullPin.length !== 5) {
      setError('Please enter all 5 digits');
      return;
    }

    setIsLoading(true);
    try {
      await onVerify(fullPin);
    } catch (err) {
      setError('Wrong PIN. Please try again.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      // Clear PIN inputs
      setPin(['', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-[#2C3E50]">Enter PIN</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className={`flex justify-center gap-4 mb-6 ${shake ? 'animate-shake' : ''}`}>
          {pin.map((digit, index) => (
            <input
              key={index}
              ref={(el) => inputRefs.current[index] = el}
              type="password"
              value={digit}
              onChange={(e) => handlePinChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 border-2 border-gray-300 rounded-lg text-center text-2xl focus:border-[#2C3E50] focus:ring-2 focus:ring-[#2C3E50]"
              maxLength={1}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          fullWidth
        >
          {isLoading ? 'Verifying...' : 'Submit'}
        </Button>
      </div>
    </div>
  );
};