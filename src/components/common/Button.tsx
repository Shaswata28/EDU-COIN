import { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyles = 'px-6 py-2 rounded-md transition-all duration-300 hover-lift font-medium';
  const variants = {
    primary: 'bg-[#2C3E50] hover:bg-[#1A2533] text-white',
    secondary: 'bg-[#8FA398] hover:bg-[#7E9287] text-white',
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};