const NotificationToggle = ({ title, description, defaultChecked = false }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
        </label>
      </div>
    </div>
  );
};

const NotificationsTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Notification Preferences</h2>
      
      <div className="space-y-4">
        <NotificationToggle
          title="Order Updates"
          description="Get notified about your order status changes"
          defaultChecked={true}
        />

        <NotificationToggle
          title="New Products"
          description="Receive updates about new products and offers"
        />

        <NotificationToggle
          title="Promotional Emails"
          description="Receive special offers and discounts"
        />
      </div>
    </div>
  );
};

export default NotificationsTab;
