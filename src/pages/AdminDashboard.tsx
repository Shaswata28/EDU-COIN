import { useState } from 'react';
import { MessageSquare, LayoutDashboard, Users } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Button } from '../components/common/Button';
import { MessageInbox } from '../components/admin/MessageInbox';
import { AnalyticsDashboard } from '../components/admin/AnalyticsDashboard';
import { useAuth } from '../context/AuthContext';
import { getGreeting } from '../utils/dateTime';
import { useNavigate } from 'react-router-dom'; 

export const AdminDashboard = () => {
  const [showMessages, setShowMessages] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      <Header username={user?.username || ""}
      onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      isSidebarOpen={isSidebarOpen} />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-[#2C3E50]">
              {getGreeting()}, Admin
            </h2>
            <div className="flex gap-4">
              <Button
                onClick={() => {
                  setShowAnalytics(true);
                  setShowMessages(false);
                }}
                className={`flex items-center gap-2 ${
                  showAnalytics ? "bg-[#2C3E50]" : "bg-gray-500"
                }`}
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </Button>
              <Button
                onClick={() => navigate('/admin/users')} 
                className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600"
              >
                <Users className="h-5 w-5" />
                Users
              </Button>
              <Button
                onClick={() => {
                  setShowMessages(!showMessages);
                  setShowAnalytics(false);
                }}
                className={`flex items-center gap-2 ${
                  showMessages ? "bg-[#2C3E50]" : "bg-gray-500"
                }`}
              >
                <MessageSquare className="h-5 w-5" />
                Messages
              </Button>
            </div>
          </div>

          {showMessages ? (
            <MessageInbox />
          ) : showAnalytics ? (
            <AnalyticsDashboard />
          ) : null}
        </div>
      </main>
    </div>
  );
};