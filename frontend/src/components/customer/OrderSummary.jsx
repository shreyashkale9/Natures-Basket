import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner';

const OrderSummary = ({ 
  items, 
  total, 
  itemCount, 
  onSubmit, 
  isProcessing 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-xl shadow-soft p-6 sticky top-6"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
      
      {/* Order Items */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.product._id} className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0">
              {item.product.thumbnail ? (
                <img
                  src={item.product.thumbnail}
                  alt={item.product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center rounded-lg">
                  <span className="text-gray-400 text-xs">IMG</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate">{item.product.name}</h4>
              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
            </div>
            <div className="text-right">
              <div className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 border-t border-gray-200 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal ({itemCount} items)</span>
          <span className="font-medium">${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium text-green-600">Free</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Platform Fee</span>
          <span className="font-medium">${(total * 0.05).toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>${(total * 1.05).toFixed(2)}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Including all fees</p>
        </div>
      </div>

      {/* Place Order Button */}
      <button
        onClick={onSubmit}
        disabled={isProcessing}
        className="btn-primary w-full py-3 text-base font-medium mt-6"
      >
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <LoadingSpinner size="sm" className="mr-2" />
            Processing Order...
          </div>
        ) : (
          <>
            <Lock className="w-5 h-5 mr-2" />
            Place Order
          </>
        )}
      </button>

      {/* Security Notice */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Your payment information is encrypted and secure
        </p>
      </div>
    </motion.div>
  );
};

export default OrderSummary;
