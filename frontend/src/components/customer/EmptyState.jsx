import { Search } from 'lucide-react';

const EmptyState = ({ onClearFilters }) => {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Search className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-3">No products found</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Try adjusting your search or filters. We're constantly adding new products from local farmers.
      </p>
      <button
        onClick={onClearFilters}
        className="btn-primary"
      >
        Show All Products
      </button>
    </div>
  );
};

export default EmptyState;
