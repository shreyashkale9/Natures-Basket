import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  UserPlus,
  BarChart3,
  Settings,
  MapPin
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard,
      exact: true
    },
    {
      name: 'Farmers',
      path: '/admin/farmers',
      icon: Users,
      exact: false
    },
    {
      name: 'Products',
      path: '/admin/products',
      icon: Package,
      exact: false
    },
    {
      name: 'Lands',
      path: '/admin/lands',
      icon: MapPin,
      exact: false
    },
    {
      name: 'Orders',
      path: '/admin/orders',
      icon: ShoppingCart,
      exact: false
    },
    {
      name: 'Users',
      path: '/admin/users',
      icon: Users,
      exact: false
    },
    {
      name: 'Create User',
      path: '/admin/users/create',
      icon: UserPlus,
      exact: false
    },
    {
      name: 'Analytics',
      path: '/admin/analytics',
      icon: BarChart3,
      exact: false
    },
    {
      name: 'Activity',
      path: '/admin/activity',
      icon: Settings,
      exact: false
    }
  ];

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">🌿</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Admin Panel</h2>
            <p className="text-xs text-gray-500">Nature's Basket</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item)
                    ? 'bg-green-50 text-green-700 border-r-2 border-green-600'
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Quick Stats */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Stats</h3>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Pending Farmers:</span>
              <span className="font-medium text-yellow-600">5</span>
            </div>
            <div className="flex justify-between">
              <span>Pending Products:</span>
              <span className="font-medium text-yellow-600">12</span>
            </div>
            <div className="flex justify-between">
              <span>Pending Lands:</span>
              <span className="font-medium text-emerald-600">3</span>
            </div>
            <div className="flex justify-between">
              <span>New Orders:</span>
              <span className="font-medium text-blue-600">8</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
