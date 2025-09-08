import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { adminApi } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Analytics = () => {
  const { data: analyticsData, isLoading, error } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: adminApi.getAnalytics,
  });

  // Mock data for demonstration (replace with real data when available)
  const mockAnalytics = {
    overview: {
      totalRevenue: 125430,
      totalOrders: 1247,
      totalUsers: 892,
      totalProducts: 156,
      revenueGrowth: 12.5,
      ordersGrowth: 8.3,
      usersGrowth: 15.2,
      productsGrowth: 3.1
    },
    salesData: [
      { month: 'Jan', sales: 12000, orders: 45 },
      { month: 'Feb', sales: 15000, orders: 52 },
      { month: 'Mar', sales: 18000, orders: 61 },
      { month: 'Apr', sales: 22000, orders: 73 },
      { month: 'May', sales: 25000, orders: 84 },
      { month: 'Jun', sales: 28000, orders: 92 }
    ],
    topProducts: [
      { name: 'Organic Tomatoes', sales: 1250, revenue: 18750 },
      { name: 'Fresh Lettuce', sales: 980, revenue: 14700 },
      { name: 'Carrots', sales: 850, revenue: 12750 },
      { name: 'Bell Peppers', sales: 720, revenue: 10800 },
      { name: 'Cucumbers', sales: 650, revenue: 9750 }
    ],
    userActivity: [
      { time: '00:00', users: 12 },
      { time: '04:00', users: 8 },
      { time: '08:00', users: 45 },
      { time: '12:00', users: 78 },
      { time: '16:00', users: 92 },
      { time: '20:00', users: 65 }
    ]
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-medium">Error loading analytics</h3>
        <p className="text-red-600 mt-2">{error.message}</p>
      </div>
    );
  }

  // Handle both real API data and mock data
  const data = analyticsData ? {
    overview: {
      totalRevenue: analyticsData.totalRevenue || 0,
      totalOrders: analyticsData.totalOrders || 0,
      totalUsers: analyticsData.totalUsers || 0,
      totalProducts: analyticsData.totalProducts || 0,
      revenueGrowth: 12.5, // Mock growth data
      ordersGrowth: 8.3,
      usersGrowth: 15.2,
      productsGrowth: 3.1
    },
    salesData: mockAnalytics.salesData,
    topProducts: mockAnalytics.topProducts,
    userActivity: mockAnalytics.userActivity
  } : mockAnalytics;

  const StatCard = ({ title, value, growth, icon: Icon, color = "blue" }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <div className="flex items-center mt-2">
            {growth > 0 ? (
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(growth)}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last month</span>
          </div>
        </div>
        <div className={`p-3 rounded-lg bg-${color}-50`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </motion.div>
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor your business performance and insights</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </motion.div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(data.overview.totalRevenue)}
          growth={data.overview.revenueGrowth}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Total Orders"
          value={formatNumber(data.overview.totalOrders)}
          growth={data.overview.ordersGrowth}
          icon={ShoppingCart}
          color="blue"
        />
        <StatCard
          title="Total Users"
          value={formatNumber(data.overview.totalUsers)}
          growth={data.overview.usersGrowth}
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Total Products"
          value={formatNumber(data.overview.totalProducts)}
          growth={data.overview.productsGrowth}
          icon={Package}
          color="orange"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Sales Overview</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {data.salesData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">{item.month}</span>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(item.sales / 30000) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-16 text-right">
                    {formatCurrency(item.sales)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {data.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-green-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.sales} sales</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(product.revenue)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* User Activity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">User Activity (24h)</h3>
          <Activity className="h-5 w-5 text-gray-400" />
        </div>
        <div className="flex items-end space-x-2 h-32">
          {data.userActivity.map((activity, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-blue-500 rounded-t"
                style={{ height: `${(activity.users / 100) * 100}%` }}
              ></div>
              <span className="text-xs text-gray-500 mt-2">{activity.time}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-gray-900">Export Report</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">View Details</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Calendar className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-900">Schedule Report</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
