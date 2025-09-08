import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, 
  ShoppingCart,
  Heart,
  Eye,
  Leaf,
  Sparkles,
  Zap
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const ProductCard = ({ 
  product, 
  index, 
  viewMode, 
  canAddToCart, 
  onAddToCart 
}) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to purchase items');
      navigate('/login');
      return;
    }
    if (user?.role !== 'customer') {
      toast.error('Only customers can purchase items');
      return;
    }
    
    // Add to cart and navigate to checkout
    addToCart(product._id, 1);
    setTimeout(() => {
      navigate('/cart');
    }, 500);
  };
  return (
    <motion.div
      key={product._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={
        viewMode === 'grid'
          ? 'bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200 group'
          : 'bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-green-200 group'
      }
    >
      {viewMode === 'grid' ? (
        <div>
          {/* Product Image */}
          <div className="relative h-48 bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden">
            {product.images && product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Leaf className="w-16 h-16 text-green-300" />
              </div>
            )}
            
            {/* Badges */}
            <div className="absolute top-3 left-3">
              {product.organic && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Organic
                </span>
              )}
            </div>
            
            <div className="absolute top-3 right-3 flex space-x-2">
              <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-sm">
                <Heart className="w-4 h-4 text-gray-600" />
              </button>
              <Link
                to={`/products/${product._id}`}
                className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-sm"
              >
                <Eye className="w-4 h-4 text-gray-600" />
              </Link>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {product.category}
              </span>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-1">
                  {product.averageRating?.toFixed(1) || '0.0'}
                </span>
              </div>
            </div>

            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-lg">
              {product.name}
            </h3>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {product.description}
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-green-600">
                    ₹{product.price}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-gray-500 line-through ml-2">
                      ₹{product.originalPrice}
                    </span>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    per {product.unit}
                  </div>
                </div>
                {canAddToCart && (
                  <button
                    onClick={() => onAddToCart(product._id)}
                    className="btn-primary p-3 rounded-full hover:scale-105 transition-transform"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              {/* Buy Now Button */}
              {canAddToCart && (
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-105"
                >
                  <Zap className="w-4 h-4" />
                  <span>Buy Now</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-6">
          {/* Product Image */}
          <div className="relative w-32 h-32 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl flex-shrink-0 overflow-hidden">
            {product.images && product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Leaf className="w-12 h-12 text-green-300" />
              </div>
            )}
            
            {/* Organic Badge */}
            {product.organic && (
              <div className="absolute top-2 left-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Organic
                </span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900 text-xl truncate">
                {product.name}
              </h3>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {product.category}
              </span>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-1">
                  {product.averageRating?.toFixed(1) || '0.0'}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {product.stock} {product.unit} available
              </span>
            </div>
          </div>

          {/* Price and Actions */}
          <div className="flex flex-col items-end space-y-4">
            <div className="text-right">
              <span className="text-2xl font-bold text-green-600">
                ₹{product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="text-sm text-gray-500 line-through">
                  ₹{product.originalPrice}
                </div>
              )}
              <div className="text-xs text-gray-500 mt-1">
                per {product.unit}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                to={`/products/${product._id}`}
                className="btn-outline px-4 py-2"
              >
                <Eye className="w-4 h-4 mr-2" />
                View
              </Link>
              {canAddToCart && (
                <>
                  <button
                    onClick={() => onAddToCart(product._id)}
                    className="btn-primary px-4 py-2"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 hover:scale-105"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Buy Now</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductCard;
