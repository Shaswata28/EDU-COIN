import { CheckCircle } from 'lucide-react';

interface SuccessPopupProps {
  message: string;
}

export const SuccessPopup = ({ message }: SuccessPopupProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-xl flex items-center space-x-3">
        <CheckCircle className="h-6 w-6 text-green-500" />
        <p className="text-[#2C3E50] font-medium">{message}</p>
      </div>
    </div>
  );
};