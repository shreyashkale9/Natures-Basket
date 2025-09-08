import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

const AccountStatusBanner = ({ user }) => {
  const getStatusInfo = (status) => {
    switch (status) {
      case 'active':
        return {
          icon: CheckCircle,
          color: 'bg-green-100 text-green-800 border-green-200',
          title: 'Account Activated',
          description: 'Your account is fully active and you can sell products'
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          title: 'Account Pending',
          description: 'Your account is under review. You can still access the dashboard and prepare your products.'
        };
      case 'inactive':
        return {
          icon: AlertCircle,
          color: 'bg-red-100 text-red-800 border-red-200',
          title: 'Account Inactive',
          description: 'Your account has been deactivated. Please contact support for assistance.'
        };
      default:
        return {
          icon: AlertCircle,
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          title: 'Unknown Status',
          description: 'Your account status is unclear. Please contact support.'
        };
    }
  };

  const statusInfo = getStatusInfo(user.status);
  const StatusIcon = statusInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-8 p-6 rounded-2xl border ${statusInfo.color} shadow-lg`}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <StatusIcon className="w-8 h-8" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">{statusInfo.title}</h3>
          <p className="text-sm opacity-90 mb-3">{statusInfo.description}</p>
          {user.status === 'pending' && (
            <div className="text-sm opacity-75">
              <p><strong>Farm Location:</strong> {user.farmLocation}</p>
              <p><strong>Description:</strong> {user.farmDescription}</p>
            </div>
          )}
          
          {/* Demo Credentials Info */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-2">Demo Account Information:</p>
            <p className="text-xs text-blue-700">
              <strong>Email:</strong> demo@farmer.com<br/>
              <strong>Password:</strong> demo123
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AccountStatusBanner;
