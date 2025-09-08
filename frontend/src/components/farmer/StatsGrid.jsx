import { motion } from 'framer-motion';
import { Package, Leaf, Clock, TrendingUp, MapPin, CheckCircle } from 'lucide-react';

const StatsGrid = ({ products, lands = [] }) => {
  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: 'text-blue-600' },
    { label: 'Active Products', value: products.filter(p => p.status === 'active' && p.isApproved).length, icon: Leaf, color: 'text-green-600' },
    { label: 'Pending Approval', value: products.filter(p => p.status === 'pending').length, icon: Clock, color: 'text-yellow-600' },
    { label: 'Total Lands', value: lands.length, icon: MapPin, color: 'text-emerald-600' },
    { label: 'Approved Lands', value: lands.filter(l => l.status === 'approved').length, icon: CheckCircle, color: 'text-green-600' },
    { label: 'Total Sales', value: products.reduce((sum, p) => sum + (p.sales || 0), 0), icon: TrendingUp, color: 'text-purple-600' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StatsGrid;
