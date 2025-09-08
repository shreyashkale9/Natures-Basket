import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Clock, 
  User, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Filter,
  Search,
  Calendar,
  Activity as ActivityIcon,
  TrendingUp,
  Eye,
  Download
} from 'lucide-react';
import { adminApi } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Activity = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: activityData, isLoading, error } = useQuery({
    queryKey: ['admin-activity'],
    queryFn: adminApi.getActivityLog,
  });

  // Mock data for demonstration (replace with real data when available)
  const mockActivityData = [
    {
      id: 1,
      type: 'user_registration',
      action: 'New user registered',
      user: 'John Doe',
      userEmail: 'john@example.com',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      status: 'success',
      details: 'User registered with email john@example.com',
      icon: User,
      color: 'green'
    },
    {
      id: 2,
      type: 'product_approval',
      action: 'Product approved',
      user: 'Admin User',
      userEmail: 'admin@naturesbasket.com',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      status: 'success',
      details: 'Organic Tomatoes product approved for listing',
      icon: Package,
      color: 'blue'
    },
    {
      id: 3,
      type: 'order_placed',
      action: 'New order placed',
      user: 'Jane Smith',
      userEmail: 'jane@example.com',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: 'success',
      details: 'Order #1234 placed for ₹45.50',
      icon: ShoppingCart,
      color: 'purple'
    },
    {
      id: 4,
      type: 'farmer_verification',
      action: 'Farmer verified',
      user: 'Admin User',
      userEmail: 'admin@naturesbasket.com',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      status: 'success',
      details: 'Farmer Mike Johnson verified and activated',
      icon: Users,
      color: 'green'
    },
    {
      id: 5,
      type: 'system_alert',
      action: 'System maintenance',
      user: 'System',
      userEmail: 'system@naturesbasket.com',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      status: 'warning',
      details: 'Scheduled maintenance completed successfully',
      icon: Settings,
      color: 'yellow'
    },
    {
      id: 6,
      type: 'product_rejection',
      action: 'Product rejected',
      user: 'Admin User',
      userEmail: 'admin@naturesbasket.com',
      timestamp: new Date(Date.now() - 90 * 60 * 1000),
      status: 'error',
      details: 'Product "Expired Vegetables" rejected due to quality issues',
      icon: Package,
      color: 'red'
    },
    {
      id: 7,
      type: 'user_login',
      action: 'User login',
      user: 'Sarah Wilson',
      userEmail: 'sarah@example.com',
      timestamp: new Date(Date.now() - 120 * 60 * 1000),
      status: 'success',
      details: 'User logged in from IP 192.168.1.100',
      icon: User,
      color: 'blue'
    },
    {
      id: 8,
      type: 'analytics_update',
      action: 'Analytics updated',
      user: 'System',
      userEmail: 'system@naturesbasket.com',
      timestamp: new Date(Date.now() - 180 * 60 * 1000),
      status: 'info',
      details: 'Daily analytics report generated',
      icon: TrendingUp,
      color: 'indigo'
    }
  ];

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
        <h3 className="text-red-800 font-medium">Error loading activity log</h3>
        <p className="text-red-600 mt-2">{error.message}</p>
      </div>
    );
  }

  // Handle both real API data and mock data
  const data = activityData && Array.isArray(activityData) ? activityData : mockActivityData;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const activityDate = new Date(timestamp);
    const diff = now - activityDate;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else {
      return `${days} days ago`;
    }
  };

  const filteredData = data.filter(activity => {
    const matchesFilter = filter === 'all' || activity.status === filter;
    const matchesSearch = searchTerm === '' || 
      activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.details.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const ActivityItem = ({ activity, index }) => {
    const Icon = activity.icon || ActivityIcon; // Fallback to ActivityIcon if undefined
    
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`relative border-l-4 border-${activity.color || 'gray'}-500 pl-6 pb-8`}
      >
        <div className={`${getStatusColor(activity.status)} rounded-lg p-4 border`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg bg-${activity.color || 'gray'}-100`}>
                <Icon className={`h-5 w-5 text-${activity.color || 'gray'}-600`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-semibold text-gray-900">{activity.action}</h4>
                  {getStatusIcon(activity.status)}
                </div>
                <p className="text-sm text-gray-600 mt-1">{activity.details || 'No details available'}</p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{activity.user || 'Unknown User'}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{activity.timestamp ? formatTimeAgo(activity.timestamp) : 'Unknown time'}</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-400">
              {activity.timestamp ? new Date(activity.timestamp).toLocaleTimeString() : '--:--:--'}
            </div>
          </div>
        </div>
      </motion.div>
    );
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
          <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
          <p className="text-gray-600 mt-1">Monitor all system activities and user actions</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Eye className="h-4 w-4" />
            <span>View All</span>
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Activities</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{data.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <ActivityIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {data.filter(a => a.status === 'success').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Warnings</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {data.filter(a => a.status === 'warning').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Errors</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {data.filter(a => a.status === 'error').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-red-50">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Activities</option>
                <option value="success">Success</option>
                <option value="warning">Warnings</option>
                <option value="error">Errors</option>
                <option value="info">Info</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Showing {filteredData.length} of {data.length} activities</span>
          </div>
        </div>
      </motion.div>

      {/* Activity Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
        
        <div className="space-y-0">
          {filteredData.map((activity, index) => (
            <ActivityItem key={activity.id} activity={activity} index={index} />
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <ActivityIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Activity;
