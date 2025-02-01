import { LayoutDashboard, CreditCard, Wallet, History, HelpCircle, BarChart2, Trophy } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/home' },
  { icon: CreditCard, label: 'Make Payment', path: '/payment' },
  { icon: Wallet, label: 'Wallet Top up', path: '/topup' },
  { icon: History, label: 'Transaction History', path: '/history' },
  { icon: BarChart2, label: 'Analytics', path: '/analytics' },
  { icon: Trophy, label: 'Achievements', path: '/achievements' },
  { icon: HelpCircle, label: 'Help', path: '/help' },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 h-full bg-[#2C3E50] text-white p-6">
      <div className="space-y-6">
        {menuItems.map(({ icon: Icon, label, path }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors
              ${location.pathname === path 
                ? 'bg-[#FFD700] text-[#2C3E50]' 
                : 'hover:bg-[#3D5166]'}`}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};