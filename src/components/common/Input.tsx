import { type InputHTMLAttributes, type ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  startAdornment?: ReactNode;
}

export const Input = ({
  label,
  error,
  className = '',
  startAdornment,
  ...props
}: InputProps) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-[#2C3E50] mb-2 font-medium">
          {label}
        </label>
      )}
      <div className="relative">
        {startAdornment && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            {startAdornment}
          </div>
        )}
        <input
          className={`w-full px-4 py-2 ${startAdornment ? 'pl-10' : ''} rounded-md border border-[#D1D5DB] 
            bg-white focus:outline-none focus:ring-2 focus:ring-[#A0C1D1] 
            focus:border-transparent transition-all duration-200 ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};