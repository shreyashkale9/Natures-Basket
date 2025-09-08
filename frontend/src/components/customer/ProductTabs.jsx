import { MessageCircle, ThumbsUp, User } from 'lucide-react';
import ProductDescription from './ProductDescription';
import ProductReviews from './ProductReviews';
import FarmerInfo from './FarmerInfo';

const ProductTabs = ({ product, user, activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'description', label: 'Description', icon: MessageCircle },
    { id: 'reviews', label: 'Reviews', icon: ThumbsUp },
    { id: 'farmer', label: 'Farmer Info', icon: User },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return <ProductDescription product={product} />;
      case 'reviews':
        return <ProductReviews product={product} user={user} />;
      case 'farmer':
        return <FarmerInfo product={product} />;
      default:
        return <ProductDescription product={product} />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-soft">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ProductTabs;
