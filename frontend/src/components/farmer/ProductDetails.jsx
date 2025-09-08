import { motion } from 'framer-motion';

const ProductDetails = ({ register, errors, product, setValue }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-xl shadow-soft p-6"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">Product Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Harvest Date
          </label>
          <input
            type="date"
            {...register('harvestDate')}
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expiry Date
          </label>
          <input
            type="date"
            {...register('expiryDate')}
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Farm Location
          </label>
          <input
            type="text"
            {...register('farmLocation')}
            className="input"
            placeholder="e.g., Organic Valley Farm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Organic Certification
          </label>
          <input
            type="text"
            {...register('organicCertification')}
            className="input"
            placeholder="e.g., USDA Organic"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nutritional Information
        </label>
        <textarea
          {...register('nutritionalInfo')}
          rows={3}
          className="input"
          placeholder="Enter nutritional information..."
        />
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Storage Instructions
        </label>
        <textarea
          {...register('storageInstructions')}
          rows={3}
          className="input"
          placeholder="How should customers store this product?"
        />
      </div>

      <div className="mt-6">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register('isOrganic')}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm font-medium text-gray-700">
            This is an organic product
          </span>
        </label>
      </div>
    </motion.div>
  );
};

export default ProductDetails;
