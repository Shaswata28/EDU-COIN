import { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { BudgetPlanner } from '../components/budget/BudgetPlanner';
import { useAuth } from '../context/AuthContext';

export const BudgetPlannerPage = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  if (!user) return null;

  return (
    <div className="h-screen flex flex-col bg-[#F5F5F5]">
      <Header 
        username={user.username}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <BudgetPlanner />
        </main>
      </div>
    </div>
  );
};