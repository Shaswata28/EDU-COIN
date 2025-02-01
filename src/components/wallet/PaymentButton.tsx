import { type ReactNode } from 'react';

interface PaymentButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

export const PaymentButton = ({ icon, label, onClick }: PaymentButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-[#2C3E50] hover:bg-gray-50 transition-all duration-200"
    >
      <div className="text-[#2C3E50] mb-2">{icon}</div>
      <span className="text-sm font-medium text-[#2C3E50]">{label}</span>
    </button>
  );
};