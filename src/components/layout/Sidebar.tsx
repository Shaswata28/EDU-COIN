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
      {/* Toggle Button - Always visible */}
      

      {/* Sidebar */}
      <div 
        className={`fixed top-16 bottom-0 left-0 w-64 bg-[#2C3E50] text-white p-6 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } z-40`}
      >
        <div className="space-y-6 mt-12">
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

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity duration-300"
          onClick={onToggle}
        />
      )}
    </>
  );
};