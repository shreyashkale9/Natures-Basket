import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Save, ArrowLeft } from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner';
import ProductBasicInfo from './ProductBasicInfo';
import ProductDetails from './ProductDetails';
import ProductImageManager from './ProductImageManager';

const ProductForm = ({ 
  product, 
  onSubmit, 
  isSubmitting, 
  onCancel, 
  images, 
  setImages, 
  existingImages, 
  setExistingImages 
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onCancel}
          className="btn-outline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600 mt-2">
            Update your product information and images
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <ProductBasicInfo 
              register={register}
              errors={errors}
              product={product}
              setValue={setValue}
            />
            <ProductDetails 
              register={register}
              errors={errors}
              product={product}
              setValue={setValue}
            />
          </div>

          {/* Image Management */}
          <div className="lg:col-span-1">
            <ProductImageManager
              images={images}
              setImages={setImages}
              existingImages={existingImages}
              setExistingImages={setExistingImages}
            />
          </div>
        </div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200"
        >
          <button
            type="button"
            onClick={onCancel}
            className="btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <LoadingSpinner size="sm" className="mr-2" />
                Updating Product...
              </div>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Update Product
              </>
            )}
          </button>
        </motion.div>
      </form>
    </div>
  );
};

export default ProductForm;
