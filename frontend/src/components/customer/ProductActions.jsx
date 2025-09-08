import { ShoppingCart, Heart, Package, User } from 'lucide-react';

const ProductActions = ({ 
  product, 
  quantity, 
  setQuantity, 
  canAddToCart, 
  user, 
  onAddToCart 
}) => {
  return (
    <div className="space-y-4">
      {/* Add to Cart */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Quantity:</label>
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-2 hover:bg-gray-100 transition-colors"
            >
              -
            </button>
            <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-2 hover:bg-gray-100 transition-colors"
            >
              +
            </button>
          </div>
        </div>
        
        <div className="flex space-x-4">
          {canAddToCart ? (
            <button
              onClick={onAddToCart}
              className="btn-primary flex-1"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </button>
          ) : user?.role === 'farmer' ? (
            <div className="flex-1 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700 text-center">
                <Package className="w-4 h-4 inline mr-2" />
                Farmers can sell products, not buy them
              </p>
            </div>
          ) : null}
          <button className="btn-outline">
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Farmer Info */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{product.farmName || 'Local Farm'}</h3>
            <p className="text-sm text-gray-600">Verified Farmer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductActions;
