import { motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';

const PaymentForm = ({ 
  paymentMethod, 
  setPaymentMethod, 
  register, 
  errors 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-xl shadow-soft p-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
          <p className="text-gray-600">How would you like to pay?</p>
        </div>
      </div>

      <div className="space-y-4">
        <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            value="card"
            checked={paymentMethod === 'card'}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="text-primary-600"
          />
          <CreditCard className="w-5 h-5 text-gray-600" />
          <span className="font-medium">Credit/Debit Card</span>
        </label>

        <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            value="paypal"
            checked={paymentMethod === 'paypal'}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="text-primary-600"
          />
          <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <span className="font-medium">PayPal</span>
        </label>
      </div>

      {paymentMethod === 'card' && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Number *
            </label>
            <input
              type="text"
              {...register('cardNumber', { 
                required: 'Card number is required',
                pattern: {
                  value: /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/,
                  message: 'Please enter a valid card number'
                }
              })}
              className="input"
              placeholder="1234 5678 9012 3456"
            />
            {errors.cardNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.cardNumber.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date *
              </label>
              <input
                type="text"
                {...register('cardExpiry', { 
                  required: 'Expiry date is required',
                  pattern: {
                    value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                    message: 'Please enter in MM/YY format'
                  }
                })}
                className="input"
                placeholder="MM/YY"
              />
              {errors.cardExpiry && (
                <p className="text-red-500 text-sm mt-1">{errors.cardExpiry.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVC *
              </label>
              <input
                type="text"
                {...register('cardCvc', { 
                  required: 'CVC is required',
                  pattern: {
                    value: /^\d{3,4}$/,
                    message: 'Please enter a valid CVC'
                  }
                })}
                className="input"
                placeholder="123"
              />
              {errors.cardCvc && (
                <p className="text-red-500 text-sm mt-1">{errors.cardCvc.message}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PaymentForm;
