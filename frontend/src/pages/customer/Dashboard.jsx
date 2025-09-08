import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  ShoppingBag, 
  Package, 
  Clock, 
  Star,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Truck,
  Heart,
  Search,
  Filter,
  ShoppingCart,
  MapPin,
  Leaf
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { productApi } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const { itemCount, total, addToCart } = useCart();

  // Fetch featured products
  const { data: featuredProducts, isLoading: productsLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productApi.getProducts({ limit: 6, featured: true }),
  });

  // Mock data - in real app, this would come from API
  const stats = [
    {
      title: 'Total Orders',
      value: '12',
      change: '+2',
      changeType: 'positive',
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: 'Cart Items',
      value: itemCount.toString(),
      change: '',
      changeType: 'neutral',
      icon: ShoppingBag,
      color: 'bg-green-500'
    },
    {
      title: 'Pending Orders',
      value: '3',
      change: '-1',
      changeType: 'negative',
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: 'Total Spent',
      value: '₹456.78',
      change: '+₹23.45',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-purple-500'
    }
  ];

  const recentOrders = [
    {
      id: 'NB24120001',
      date: '2024-01-15',
      status: 'delivered',
      total: 89.99,
      items: 5
    },
    {
      id: 'NB24120002',
      date: '2024-01-12',
      status: 'in-transit',
      total: 67.50,
      items: 3
    },
    {
      id: 'NB24120003',
      date: '2024-01-10',
      status: 'processing',
      total: 123.75,
      items: 7
    }
  ];

  const quickActions = [
    {
      title: 'Browse Products',
      description: 'Explore fresh organic vegetables',
      icon: Package,
      href: '/products',
      color: 'bg-primary-500'
    },
    {
      title: 'View Cart',
      description: `${itemCount} items • ₹${total.toFixed(2)}`,
      icon: ShoppingBag,
      href: '/cart',
      color: 'bg-secondary-500'
    },
    {
      title: 'Order History',
      description: 'Track your past orders',
      icon: Clock,
      href: '/orders',
      color: 'bg-accent-500'
    },
    {
      title: 'Update Profile',
      description: 'Manage your account details',
      icon: Star,
      href: '/profile',
      color: 'bg-purple-500'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'in-transit':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <Truck className="w-4 h-4" />;
      case 'in-transit':
        return <TrendingUp className="w-4 h-4" />;
      case 'processing':
        return <Clock className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-primary-100">
          Ready to explore fresh organic vegetables from local farmers?
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            className="bg-white rounded-xl p-6 shadow-soft hover:shadow-medium transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                {stat.change && (
                  <p className={`text-sm ${
                    stat.changeType === 'positive' ? 'text-green-600' : 
                    stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {stat.change} from last month
                  </p>
                )}
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl p-6 shadow-soft"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.href}
              className="group block p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-medium transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${action.color}`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-xl p-6 shadow-soft"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <Link
            to="/orders"
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View all
          </Link>
        </div>
        
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{order.id}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.date).toLocaleDateString()} • {order.items} items
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">₹{order.total}</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status.replace('-', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Featured Products Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-soft"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Fresh Organic Products</h2>
          <Link
            to="/products"
            className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center space-x-1"
          >
            <span>Browse all</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {productsLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts?.products?.slice(0, 6).map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white rounded-xl border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden">
                  {product.images && product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Leaf className="w-16 h-16 text-green-300" />
                    </div>
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3">
                    {product.organic && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Leaf className="w-3 h-3 mr-1" />
                        Organic
                      </span>
                    )}
                  </div>
                  
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-sm">
                      <Heart className="w-4 h-4 text-gray-600" />
                    </button>
                    <Link
                      to={`/products/${product._id}`}
                      className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-sm"
                    >
                      <Search className="w-4 h-4 text-gray-600" />
                    </Link>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {product.category}
                    </span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">
                        {product.averageRating?.toFixed(1) || '0.0'}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-green-600">
                        ₹{product.price}
                      </span>
                      <div className="text-xs text-gray-500">
                        per {product.unit}
                      </div>
                    </div>
                    <button
                      onClick={() => addToCart(product._id)}
                      className="btn-primary p-2 rounded-full hover:scale-105 transition-transform"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CustomerDashboard;
