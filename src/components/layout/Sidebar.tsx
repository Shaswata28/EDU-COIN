import { LayoutDashboard, CreditCard, Wallet, History, HelpCircle, BarChart2, Trophy, Menu } from 'lucide-react';
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

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const location = useLocation();

  return (
    <>
      {/* Toggle Button - Visible only on mobile */}
      <button
        onClick={onToggle}
        className="md:hidden fixed top-20 left-4 z-50 p-2 rounded-lg bg-[#2C3E50] text-white hover:bg-[#1A2533] transition-colors"
        aria-label="Toggle Sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Sidebar */}
      <div 
        className={`fixed top-16 bottom-0 left-0 w-64 bg-[#2C3E50] text-white p-4 md:p-6 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } z-40`}
      >
        <div className="space-y-4 md:space-y-6 mt-8 md:mt-12">
          {menuItems.map(({ icon: Icon, label, path }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center space-x-3 p-2 md:p-3 rounded-lg transition-colors text-sm md:text-base
                ${location.pathname === path 
                  ? 'bg-[#FFD700] text-[#2C3E50]' 
                  : 'hover:bg-[#3D5166]'}`}
            >
              <Icon className="h-4 w-4 md:h-5 md:w-5" />
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Overlay - Visible only on mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity duration-300"
          onClick={onToggle}
        />
      )}
    </>
  );
};