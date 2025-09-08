import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { productApi } from '../../services/api';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Star, 
  Package, 
  Truck, 
  Shield, 
  Settings, 
  Edit,
  ShoppingCart,
  Heart,
  Share2,
  Minus,
  Plus,
  Leaf,
  CheckCircle,
  Clock,
  User
} from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import toast from 'react-hot-toast';

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProduct(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/products')}
            className="btn-primary"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user && user.role === 'farmer' && product.farmer?._id === user._id;

  const handleAddToCart = () => {
    if (user?.role !== 'customer') {
      toast.error('Please log in as a customer to add items to cart');
      return;
    }
    
    for (let i = 0; i < quantity; i++) {
      addToCart(product._id);
    }
    toast.success(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart!`);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {product.images && product.images.length > 0 ? (
              <div className="space-y-4">
                <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.slice(1, 5).map((image, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden bg-white shadow">
                        <img
                          src={image}
                          alt={`${product.name} ${index + 2}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-square rounded-2xl bg-gray-100 flex items-center justify-center">
                <Package className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    product.status === 'approved' && product.isApproved
                      ? 'bg-green-100 text-green-800'
                      : product.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.status === 'approved' && product.isApproved ? 'Available' : 
                     product.status === 'pending' ? 'Pending Approval' : 'Unavailable'}
                  </span>
                  {product.organic && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Leaf className="w-3 h-3 mr-1" />
                      Organic
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {product.averageRating && (
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">{product.averageRating.toFixed(1)}</span>
                    </div>
                  )}
                  <button
                    onClick={handleWishlist}
                    className={`p-2 rounded-full transition-colors ${
                      isWishlisted ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl font-bold text-green-600">₹{product.price}</span>
                <span className="text-sm text-gray-500">per {product.unit}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-lg text-gray-400 line-through">₹{product.originalPrice}</span>
                )}
              </div>
            </div>

            {/* Add to Cart Section */}
            {user?.role === 'customer' && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {product.stock} {product.unit} available
                </p>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2">Category</h4>
                <p className="text-gray-600 capitalize">{product.category}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2">Unit</h4>
                <p className="text-gray-600 capitalize">{product.unit}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2">Stock</h4>
                <p className="text-gray-600">{product.stock} {product.unit}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2">Season</h4>
                <p className="text-gray-600 capitalize">{product.season || 'All Season'}</p>
              </div>
            </div>

            {/* Land Information */}
            {product.land && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-green-600" />
                  Grown On
                </h3>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">{product.land.name}</p>
                  <p className="text-gray-600">
                    {product.land.location?.city}, {product.land.location?.state}
                  </p>
                  <p className="text-sm text-gray-500">
                    {product.land.size?.area} {product.land.size?.unit} • {product.land.soilType} soil
                  </p>
                </div>
              </div>
            )}

            {/* Farmer Information */}
            {product.farmer && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Farmer</h3>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">{product.farmer.name}</p>
                  <p className="text-gray-600">{product.farmer.email}</p>
                  {product.farmer.phone && (
                    <p className="text-gray-600">{product.farmer.phone}</p>
                  )}
                </div>
              </div>
            )}

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.organic && (
                  <div className="flex items-center text-green-600">
                    <Shield className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Organic Certified</span>
                  </div>
                )}
                {product.fresh && (
                  <div className="flex items-center text-green-600">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Fresh Harvest</span>
                  </div>
                )}
                {product.delivery && (
                  <div className="flex items-center text-green-600">
                    <Truck className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Home Delivery</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-gray-200">
              <div className="space-y-4">
                {/* Owner Actions */}
                {isOwner && (
                  <div className="flex space-x-4">
                    <button
                      onClick={() => navigate('/farmer/products')}
                      className="btn-outline flex-1 flex items-center justify-center"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Manage Products
                    </button>
                    <button
                      onClick={() => navigate(`/farmer/products/${product._id}/edit`)}
                      className="btn-primary flex-1 flex items-center justify-center"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Product
                    </button>
                  </div>
                )}
                
                {/* Customer Actions */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => navigate('/products')}
                    className="btn-outline flex-1"
                  >
                    Browse More Products
                  </button>
                  {product.status === 'approved' && product.isApproved && !isOwner && (
                    <button
                      onClick={() => navigate('/cart')}
                      className="btn-primary flex-1"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
