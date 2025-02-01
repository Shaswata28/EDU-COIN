import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { HelpContent } from '../components/help/HelpContent';
import { useAuth } from '../context/AuthContext';

export const HelpPage = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="h-screen flex flex-col bg-[#F5F5F5]">
      <Header username={user.username} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <HelpContent />
        </main>
      </div>
    </div>
  );
};