import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, LogOut, Settings, Coins, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/dateTime';
import { EditProfileModal } from '../profile/EditProfileModal';

interface HeaderProps {
  username: string;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Header = ({ username, onToggleSidebar, isSidebarOpen }: HeaderProps) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [currentDate, setCurrentDate] = useState(formatDate(new Date()));
  const { logout } = useAuth();
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

  const handleEditProfile = () => {
    setShowProfileMenu(false);
    setShowEditProfile(true);
  };

  return (
    <>
      <div className="bg-[#2C3E50] text-white px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={onToggleSidebar}
              className="p-2 hover:bg-[#3D5166] rounded-lg transition-colors"
              aria-label="Toggle Sidebar"
            >
              <Menu className={`h-6 w-6 transition-transform duration-300 ${isSidebarOpen ? 'rotate-180' : 'rotate-0'}`} />
            </button>
            <div className="flex items-center space-x-3 hover:scale-105 transition-transform duration-300">
              <Coins className="h-8 w-8 text-[#FFD700] animate-pulse" />
              <h1 className="text-3xl font-bold text-[#FFD700]">EDU COIN</h1>
            </div>
          </div>

          <div className="flex items-center space-x-8">
            <div className="text-right">
              <div className="text-sm text-gray-300">{currentDate}</div>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 hover:bg-[#3D5166] p-2 rounded-lg transition-colors"
              >
                <UserCircle className="h-8 w-8" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 text-[#2C3E50] z-50">
                  <button
                    onClick={handleEditProfile}
                    className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 w-full"
                  >
                    <Settings className="h-5 w-5" />
                    <span>Edit Profile</span>
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

      {showEditProfile && (
        <EditProfileModal onClose={() => setShowEditProfile(false)} />
      )}
    </>
  );
};