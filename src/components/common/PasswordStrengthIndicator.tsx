import { useMemo } from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
  const requirements = [
    { 
      label: 'At least 8 characters',
      test: (pass: string) => pass.length >= 8 
    },
    { 
      label: 'Contains uppercase letter',
      test: (pass: string) => /[A-Z]/.test(pass)
    },
    { 
      label: 'Contains number',
      test: (pass: string) => /[0-9]/.test(pass)
    },
    { 
      label: 'Contains special character',
      test: (pass: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pass)
    }
  ];

  const strength = useMemo(() => {
    if (!password) return 0;
    return requirements.filter(req => req.test(password)).length;
  }, [password]);

  const getStrengthColor = () => {
    if (strength === 0) return 'bg-gray-200';
    if (strength === 1) return 'bg-red-500';
    if (strength === 2) return 'bg-orange-500';
    if (strength === 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (!password) return null;

  return (
    <div className="space-y-3 animate-fadeIn">
      <div className="flex h-1.5 rounded-full bg-gray-200 overflow-hidden">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={`flex-1 ${index < strength ? getStrengthColor() : 'bg-gray-200'} 
              ${index > 0 ? 'ml-0.5' : ''} transition-all duration-300 strength-animate`}
          />
        ))}
      </div>

      <div className="space-y-2">
        {requirements.map((req, index) => (
          <div 
            key={index}
            className="flex items-center text-sm gap-2"
          >
            {req.test(password) ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-red-500" />
            )}
            <span className={req.test(password) ? 'text-green-700' : 'text-gray-600'}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};