const RecentActivity = () => {
  // Mock data for recent activity
  const activities = [
    {
      id: 1,
      type: 'farmer_registered',
      message: 'New farmer John Doe registered',
      time: '2 hours ago',
      icon: '🌾',
      color: 'green'
    },
    {
      id: 2,
      type: 'product_submitted',
      message: 'Organic Tomatoes submitted by Green Farm',
      time: '4 hours ago',
      icon: '🥬',
      color: 'blue'
    },
    {
      id: 3,
      type: 'order_placed',
      message: 'New order #1234 placed by customer',
      time: '6 hours ago',
      icon: '📦',
      color: 'purple'
    },
    {
      id: 4,
      type: 'farmer_approved',
      message: 'Farmer Sarah Wilson approved',
      time: '1 day ago',
      icon: '✅',
      color: 'green'
    },
    {
      id: 5,
      type: 'product_approved',
      message: 'Fresh Carrots approved for sale',
      time: '2 days ago',
      icon: '🥕',
      color: 'emerald'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg bg-${activity.color}-50 border border-${activity.color}-200`}>
              <span className="text-lg">{activity.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{activity.message}</p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View all activity →
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;
