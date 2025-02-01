import { useEffect, useState } from 'react';
import {
  Users,
  CreditCard,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { getAnalytics } from '../../services/admin';
import type { Analytics } from '../../types/analytics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Vibrant color palette
const colors = {
  primary: '#4F46E5', // Indigo
  secondary: '#7C3AED', // Purple
  success: '#059669', // Emerald
  warning: '#D97706', // Amber
  info: '#0EA5E9', // Sky
  accent1: '#EC4899', // Pink
  accent2: '#8B5CF6', // Violet
  accent3: '#F59E0B', // Yellow
  gradientStart: '#4F46E5',
  gradientEnd: '#7C3AED',
};

const StatCard = ({ title, value, icon: Icon, trend }: {
  title: string;
  value: string | number;
  icon: any;
  trend?: { value: number; isPositive: boolean };
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold mt-1 text-gray-800">{value}</h3>
        {trend && (
          <div className={`flex items-center mt-2 ${
            trend.isPositive ? 'text-emerald-500' : 'text-rose-500'
          }`}>
            {trend.isPositive ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <ArrowDownRight className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">{trend.value}% from last month</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-lg bg-gradient-to-br from-${colors.gradientStart} to-${colors.gradientEnd}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
);

export const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!analytics) return null;

  const transactionChartData = {
    labels: analytics.transactionTrends.map(t => t.date),
    datasets: [
      {
        label: 'Transaction Volume',
        data: analytics.transactionTrends.map(t => t.count),
        borderColor: colors.primary,
        backgroundColor: `${colors.primary}20`,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: colors.primary,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: colors.primary,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };

  const userActivityData = {
    labels: analytics.userActivity.map(a => `${a.hour}:00`),
    datasets: [
      {
        label: 'Active Users',
        data: analytics.userActivity.map(a => a.count),
        backgroundColor: `${colors.secondary}`,
        borderRadius: 8,
        hoverBackgroundColor: colors.primary,
      }
    ]
  };

  const categoryDistributionData = {
    labels: Object.keys(analytics.categoryDistribution),
    datasets: [
      {
        data: Object.values(analytics.categoryDistribution),
        backgroundColor: [
          colors.primary,
          colors.secondary,
          colors.success,
          colors.warning,
          colors.info,
          colors.accent1,
          colors.accent2,
          colors.accent3,
        ],
        borderWidth: 0,
        hoverOffset: 4
      }
    ]
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={analytics.totalUsers}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Total Transactions"
          value={analytics.totalTransactions}
          icon={CreditCard}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Total Volume"
          value={`৳${analytics.totalVolume.toLocaleString()}`}
          icon={TrendingUp}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Average Transaction"
          value={`৳${analytics.averageTransaction.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 3, isPositive: false }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
            <Activity className="h-5 w-5 text-indigo-600" />
            Transaction Trends
          </h3>
          <Line
            data={transactionChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false
                },
                tooltip: {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  padding: 12,
                  titleFont: {
                    size: 14,
                    weight: 'bold'
                  },
                  bodyFont: {
                    size: 13
                  },
                  displayColors: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    precision: 0,
                    color: '#6B7280'
                  },
                  grid: {
                    color: '#E5E7EB'
                  }
                },
                x: {
                  ticks: {
                    color: '#6B7280'
                  },
                  grid: {
                    display: false
                  }
                }
              }
            }}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">User Activity by Hour</h3>
          <Bar
            data={userActivityData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false
                },
                tooltip: {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  padding: 12,
                  titleFont: {
                    size: 14,
                    weight: 'bold'
                  },
                  bodyFont: {
                    size: 13
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    precision: 0,
                    color: '#6B7280'
                  },
                  grid: {
                    color: '#E5E7EB'
                  }
                },
                x: {
                  ticks: {
                    color: '#6B7280'
                  },
                  grid: {
                    display: false
                  }
                }
              }
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Activity</h3>
          <div className="space-y-4">
            {analytics.recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'deposit' 
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-rose-100 text-rose-600'
                  }`}>
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-800">{activity.description}</p>
                      <span className="text-sm text-gray-500">by</span>
                      <p className="font-medium text-indigo-600">{activity.user.name}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <p>ID: {activity.user.studentId}</p>
                      <span>•</span>
                      <p>{activity.user.email}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <span className={`font-medium ${
                  activity.type === 'deposit' ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {activity.type === 'deposit' ? '+' : '-'}
                  ৳{activity.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Payment Categories</h3>
          <Doughnut
            data={categoryDistributionData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    padding: 20,
                    font: {
                      size: 12
                    }
                  }
                },
                tooltip: {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  padding: 12,
                  titleFont: {
                    size: 14,
                    weight: 'bold'
                  },
                  bodyFont: {
                    size: 13
                  }
                }
              },
              cutout: '65%'
            }}
          />
        </div>
      </div>
    </div>
  );
};