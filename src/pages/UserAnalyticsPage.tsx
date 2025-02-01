import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Download, 
  Calendar,
  DollarSign,
  Target,
  FileSpreadsheet
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { BudgetPlanner } from '../components/analytics/BudgetPlanner';
import { useAuth } from '../context/AuthContext';
import { getUserAnalytics, exportTransactionsPDF, exportTransactionsExcel } from '../services/analytics';
import { updateBudget } from '../services/budget';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { Button } from '../components/common/Button';
import { ErrorModal } from '../components/common/ErrorModal';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const CATEGORIES = ['Canteen', 'Library', 'Lab', 'Club', 'Other'];
const COLORS = [
  'rgba(255, 99, 132, 0.8)',
  'rgba(54, 162, 235, 0.8)',
  'rgba(255, 206, 86, 0.8)',
  'rgba(75, 192, 192, 0.8)',
  'rgba(153, 102, 255, 0.8)',
];

export const UserAnalyticsPage = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getUserAnalytics(selectedMonth, selectedYear);
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
        setError('Failed to fetch analytics data');
        setShowError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedMonth, selectedYear]);

  const handleUpdateBudget = async (category: string, amount: number) => {
    try {
      await updateBudget(category, amount);
      // Refresh analytics after budget update
      const data = await getUserAnalytics(selectedMonth, selectedYear);
      setAnalytics(data);
    } catch (error) {
      setError('Failed to update budget');
      setShowError(true);
      throw error; // Re-throw to be handled by BudgetPlanner
    }
  };

  const handleExportPDF = async () => {
    try {
      const startDate = new Date(selectedYear, selectedMonth, 1).toISOString();
      const endDate = new Date(selectedYear, selectedMonth + 1, 0).toISOString();
      const blob = await exportTransactionsPDF(startDate, endDate);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions-${MONTHS[selectedMonth]}-${selectedYear}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      setError('Failed to export PDF');
      setShowError(true);
    }
  };

  const handleExportExcel = async () => {
    try {
      const startDate = new Date(selectedYear, selectedMonth, 1).toISOString();
      const endDate = new Date(selectedYear, selectedMonth + 1, 0).toISOString();
      const blob = await exportTransactionsExcel(startDate, endDate);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions-${MONTHS[selectedMonth]}-${selectedYear}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      setError('Failed to export Excel');
      setShowError(true);
    }
  };

  const monthlySpendingData = {
    labels: MONTHS,
    datasets: [{
      label: 'Monthly Spending',
      data: analytics?.monthlySpending || Array(12).fill(0),
      backgroundColor: 'rgba(54, 162, 235, 0.8)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  };

  const categoryData = {
    labels: CATEGORIES,
    datasets: [{
      data: analytics?.categorySpending || Array(5).fill(0),
      backgroundColor: COLORS,
      borderWidth: 1
    }]
  };

  if (!user) return null;

  return (
    <div className="h-screen flex flex-col bg-[#F5F5F5]">
      <Header username={user.username} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-[#2C3E50]">Financial Analytics</h2>
              <div className="flex gap-4">
                <Button 
                  onClick={handleExportPDF}
                  className="flex items-center gap-2"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Export PDF
                </Button>
                <Button 
                  onClick={handleExportExcel}
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export Excel
                </Button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Spent</p>
                    <p className="text-2xl font-bold text-[#2C3E50]">
                      ৳{analytics?.totalSpent?.toLocaleString() || '0'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Average Daily</p>
                    <p className="text-2xl font-bold text-[#2C3E50]">
                      ৳{analytics?.averageDaily?.toLocaleString() || '0'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Budget Status</p>
                    <p className="text-2xl font-bold text-[#2C3E50]">
                      {analytics?.budgetStatus || '0'}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Calendar className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Most Active Day</p>
                    <p className="text-2xl font-bold text-[#2C3E50]">
                      {analytics?.mostActiveDay || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Monthly Spending Trends */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-[#2C3E50] mb-6 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Monthly Spending Trends
                </h3>
                <div className="h-[300px]">
                  <Bar 
                    data={monthlySpendingData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: (value) => '৳' + value
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>

              {/* Spending by Category */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-[#2C3E50] mb-6 flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Spending by Category
                </h3>
                <div className="h-[300px]">
                  <Pie 
                    data={categoryData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right'
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Budget Planning Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <BudgetPlanner 
                budgets={analytics?.budgets || {}}
                onUpdateBudget={handleUpdateBudget}
              />
            </div>
          </div>
        </main>
      </div>

      <ErrorModal
        show={showError}
        message={error}
        onClose={() => setShowError(false)}
      />
    </div>
  );
};