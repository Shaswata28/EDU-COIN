
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, LogOut, Coins, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/dateTime';
import { NotificationCenter } from '../notifications/NotificationCenter';

interface HeaderProps {
  username: string;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Header = ({ username, onToggleSidebar, isSidebarOpen }: HeaderProps) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentDate, setCurrentDate] = useState(formatDate(new Date()));
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(formatDate(new Date()));
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="bg-[#2C3E50] text-white px-4 md:px-6 py-3 md:py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 md:space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-[#3D5166] rounded-lg transition-colors"
            aria-label="Toggle Sidebar"
          >
            <Menu className={`h-5 w-5 md:h-6 md:w-6 transition-transform duration-300 ${isSidebarOpen ? 'rotate-180' : 'rotate-0'}`} />
          </button>
          <div className="flex items-center space-x-2 md:space-x-3 hover:scale-105 transition-transform duration-300">
            <Coins className="h-6 w-6 md:h-8 md:w-8 text-[#FFD700] animate-pulse" />
            <h1 className="text-xl md:text-3xl font-bold text-[#FFD700]">EDU COIN</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4 md:space-x-8">
          <div className="hidden md:block text-right">
            <div className="text-sm text-gray-300">{currentDate}</div>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            {user?.role === 'student' && <NotificationCenter />}
            
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 hover:bg-[#3D5166] p-2 rounded-lg transition-colors"
              >
                <UserCircle className="h-6 w-6 md:h-8 md:w-8" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 text-[#2C3E50] z-50">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/profile');
                    }}
                    className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 w-full"
                  >
                    <UserCircle className="h-5 w-5" />
                    <span>View Profile</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 w-full text-red-600"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
