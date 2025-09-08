import { motion } from 'framer-motion';
import LoadingSpinner from '../ui/LoadingSpinner';

const SettingsTab = ({ 
  register, 
  onSubmit, 
  updatePasswordMutation 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Change Password */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              {...register('currentPassword', { required: 'Current password is required' })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              {...register('newPassword', { 
                required: 'New password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              {...register('confirmPassword', { required: 'Please confirm your password' })}
              className="input"
            />
          </div>
          <button
            type="submit"
            disabled={updatePasswordMutation.isPending}
            className="btn-primary"
          >
            {updatePasswordMutation.isPending ? (
              <div className="flex items-center">
                <LoadingSpinner size="sm" className="mr-2" />
                Updating...
              </div>
            ) : (
              'Update Password'
            )}
          </button>
        </form>
      </div>

      {/* Notification Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
            <span className="text-sm font-medium text-gray-700">Email notifications for new orders</span>
          </label>
          <label className="flex items-center space-x-3">
            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
            <span className="text-sm font-medium text-gray-700">SMS notifications for urgent orders</span>
          </label>
          <label className="flex items-center space-x-3">
            <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
            <span className="text-sm font-medium text-gray-700">Weekly sales reports</span>
          </label>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsTab;
