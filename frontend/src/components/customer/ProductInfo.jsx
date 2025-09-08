import { Star, Leaf, Calendar, Truck, Shield } from 'lucide-react';

const ProductInfo = ({ product }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
            {product.category}
          </span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
        
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(product.averageRating || 0)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {product.averageRating?.toFixed(1) || '0.0'} ({product.totalReviews || 0} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-lg text-gray-500 line-through">
              ₹{product.originalPrice}
            </span>
          )}
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600">
          {product.quantity} {product.unit} available
        </p>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Leaf className="w-4 h-4 text-green-600" />
          <span>{product.isOrganic ? 'Organic' : 'Conventional'}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span>Harvested {product.harvestDate ? new Date(product.harvestDate).toLocaleDateString() : 'Recently'}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Truck className="w-4 h-4 text-purple-600" />
          <span>Free shipping</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Shield className="w-4 h-4 text-orange-600" />
          <span>Quality guaranteed</span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
