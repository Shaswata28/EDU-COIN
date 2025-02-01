import { CreditCard, Wallet, History, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const actions = [
  { icon: CreditCard, label: 'Make Payment', path: '/payment' },
  { icon: Wallet, label: 'Top Up', path: '/topup' },
  { icon: History, label: 'History', path: '/history' },
  { icon: HelpCircle, label: 'Help', path: '/help' },
];

export const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-animate">
      {actions.map(({ icon: Icon, label, path }) => (
        <button
          key={label}
          onClick={() => navigate(path)}
          className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover-lift hover:shadow-lg transition-all duration-300"
        >
          <Icon className="h-8 w-8 text-[#2C3E50] mb-2" />
          <span className="text-sm font-medium text-[#2C3E50]">{label}</span>
        </button>
      ))}
    </div>
  );
};