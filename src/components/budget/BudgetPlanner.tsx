import { useState, useEffect } from 'react';
import { Wallet, AlertTriangle, PieChart, TrendingUp, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../common/Button';
import { getBudgets, updateBudget, getMonthlyReport } from '../../services/budget';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const CATEGORIES = ['canteen', 'library', 'lab', 'club', 'other'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const COLORS = [
  'rgba(255, 99, 132, 0.8)',
  'rgba(54, 162, 235, 0.8)',
  'rgba(255, 206, 86, 0.8)',
  'rgba(75, 192, 192, 0.8)',
  'rgba(153, 102, 255, 0.8)',
];

interface CategoryBudget {
  amount: number;
  spent: number;
}

interface BudgetData {
  [category: string]: CategoryBudget;
}

interface MonthlyReport {
  totalBudget: number;
  totalSpent: number;
  categories: {
    [category: string]: {
      budget: number;
      spent: number;
      remaining: number;
      percentage: number;
    };
  };
}

export const BudgetPlanner = () => {
  const [budgets, setBudgets] = useState<BudgetData>({});
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [editMode, setEditMode] = useState(false);
  const [newBudgets, setNewBudgets] = useState<{[key: string]: number}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

  const fetchData = async () => {
    console.log(`Fetching data for month: ${selectedMonth}, year: ${selectedYear}`);
    setIsLoading(true);
    try {
      const [budgetData, reportData] = await Promise.all([
        getBudgets(selectedMonth, selectedYear),
        getMonthlyReport(selectedMonth, selectedYear)
      ]);
      console.log('Fetched budget data:', budgetData);
      console.log('Fetched report data:', reportData);
      
      setBudgets(budgetData.budgets);
      setReport(reportData);
      setNewBudgets(
        Object.entries(budgetData.budgets).reduce((acc, [category, data]) => {
          acc[category] = data.amount;
          return acc;
        }, {} as {[key: string]: number})
      );
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch budget data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    console.log("handleSave called");
    setIsLoading(true);
    setError('');
    
    try {
      console.log("Updating budgets:", newBudgets);
      
      // Initialize default values for all categories if they don't exist
      CATEGORIES.forEach(category => {
        if (newBudgets[category] === undefined) {
          newBudgets[category] = 0;
        }
      });
      
      await Promise.all(
        Object.entries(newBudgets).map(([category, amount]) => {
          console.log(`Calling updateBudget for ${category} with amount ${amount}`);
          return updateBudget(category, amount);
        })
      );
      
      setEditMode(false);
      console.log("Updates completed, fetching new data");
      await fetchData();
    } catch (error) {
      console.error("Error updating budgets:", error);
      setError('Failed to update budgets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMonthChange = (increment: number) => {
    let newMonth = selectedMonth + increment;
    let newYear = selectedYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }

    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  const pieChartData = {
    labels: CATEGORIES.map(c => c.charAt(0).toUpperCase() + c.slice(1)),
    datasets: [{
      data: CATEGORIES.map(c => budgets[c]?.spent || 0),
      backgroundColor: COLORS,
      borderWidth: 1
    }]
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <Wallet className="h-8 w-8 text-[#2C3E50]" />
          <h2 className="text-2xl font-bold text-[#2C3E50]">Budget Planner</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleMonthChange(-1)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="h-5 w-5 text-[#2C3E50]" />
          </button>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#2C3E50]" />
            <span className="font-medium text-[#2C3E50]">
              {MONTHS[selectedMonth]} {selectedYear}
            </span>
          </div>
          
          <button
            onClick={() => handleMonthChange(1)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight className="h-5 w-5 text-[#2C3E50]" />
          </button>
          
          {/* Button now correctly calls handleSave when in edit mode */}
          <Button
            onClick={() => {
              if (editMode) {
                handleSave();
              } else {
                setEditMode(true);
              }
            }}
            disabled={isLoading}
          >
            {editMode ? 'Save Changes' : 'Edit Budgets'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <div>
              <h3 className="font-semibold text-red-800">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {report && report.totalSpent > report.totalBudget * 0.9 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <div>
              <h3 className="font-semibold text-red-800">Budget Alert</h3>
              <p className="text-red-700">
                You have spent {Math.round((report.totalSpent / report.totalBudget) * 100)}% of your total monthly budget
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-[#2C3E50]" />
            <h3 className="text-lg font-semibold text-[#2C3E50]">Category Budgets</h3>
          </div>
          
          <div className="space-y-6">
            {CATEGORIES.map((category) => {
              const budget = budgets[category] || { amount: 0, spent: 0 };
              const progress = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;

              return (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 capitalize">{category}</span>
                    {editMode ? (
                      <input
                        type="number"
                        value={newBudgets[category] || 0}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          console.log(`Setting ${category} budget to ${value}`);
                          setNewBudgets(prev => ({
                            ...prev,
                            [category]: value
                          }));
                        }}
                        className="w-24 px-2 py-1 border rounded-md"
                        min="0"
                        step="100"
                      />
                    ) : (
                      <span className="font-medium text-[#2C3E50]">
                        ৳{budget.amount.toLocaleString()}
                      </span>
                    )}
                  </div>
                  
                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`absolute left-0 top-0 h-full rounded-full transition-all duration-300 ${
                        progress > 90 ? 'bg-red-500' :
                        progress > 75 ? 'bg-amber-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      Spent: ৳{budget.spent.toLocaleString()}
                    </span>
                    <span className={`font-medium ${
                      progress > 90 ? 'text-red-600' :
                      progress > 75 ? 'text-amber-600' :
                      'text-green-600'
                    }`}>
                      {Math.round(progress)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {editMode && (
            <div className="flex justify-end gap-4 mt-6">
              <Button
                variant="secondary"
                onClick={() => {
                  console.log("Canceling edit");
                  setEditMode(false);
                  // Reset newBudgets to current budgets
                  setNewBudgets(
                    Object.entries(budgets).reduce((acc, [category, data]) => {
                      acc[category] = data.amount;
                      return acc;
                    }, {} as {[key: string]: number})
                  );
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLoading}
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="h-5 w-5 text-[#2C3E50]" />
              <h3 className="text-lg font-semibold text-[#2C3E50]">Spending Distribution</h3>
            </div>
            
            <div className="h-[300px] flex items-center justify-center">
              <Pie 
                data={pieChartData}
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

          {report && (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-[#2C3E50] mb-4">Monthly Overview</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 mb-1">Total Budget</p>
                  <p className="text-2xl font-bold text-[#2C3E50]">
                    ৳{report.totalBudget.toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600 mb-1">Total Spent</p>
                  <p className="text-2xl font-bold text-[#2C3E50]">
                    ৳{report.totalSpent.toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600 mb-1">Remaining</p>
                  <p className="text-2xl font-bold text-[#2C3E50]">
                    ৳{(report.totalBudget - report.totalSpent).toLocaleString()}
                  </p>
                </div>
                
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      (report.totalSpent / report.totalBudget) > 0.9 ? 'bg-red-500' :
                      (report.totalSpent / report.totalBudget) > 0.75 ? 'bg-amber-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min((report.totalSpent / report.totalBudget) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};