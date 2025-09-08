const SecurityTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Security Settings</h2>
      
      <div className="space-y-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Change Password</h3>
              <p className="text-gray-600">Update your password to keep your account secure</p>
            </div>
            <button className="btn-outline">
              Change Password
            </button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
              <p className="text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <button className="btn-outline">
              Enable 2FA
            </button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Login Sessions</h3>
              <p className="text-gray-600">Manage your active login sessions</p>
            </div>
            <button className="btn-outline">
              View Sessions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;
