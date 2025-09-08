import { motion } from 'framer-motion';
import { Upload, X } from 'lucide-react';

const ProductImageManager = ({ 
  images, 
  setImages, 
  existingImages, 
  setExistingImages 
}) => {
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    const totalImages = existingImages.length + images.length + imageFiles.length;
    if (totalImages > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    const newImages = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Date.now() + Math.random(),
      isExisting: false,
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (imageId) => {
    const existingImage = existingImages.find(img => img.id === imageId);
    if (existingImage) {
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
    } else {
      setImages(prev => {
        const imageToRemove = prev.find(img => img.id === imageId);
        if (imageToRemove?.preview) {
          URL.revokeObjectURL(imageToRemove.preview);
        }
        return prev.filter(img => img.id !== imageId);
      });
    }
  };

  const allImages = [...existingImages, ...images];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-xl shadow-soft p-6 sticky top-6"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">Product Images</h2>
      
      <div className="space-y-4">
        {/* Current Images */}
        {allImages.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Current Images</h3>
            <div className="grid grid-cols-2 gap-3">
              {allImages.map((image) => (
                <div key={image.id} className="relative">
                  <img
                    src={image.isExisting ? image.url : image.preview}
                    alt="Product preview"
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {image.isExisting && (
                    <div className="absolute top-1 left-1">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        Existing
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600 mb-2">
            Add more images (max 5 total)
          </p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="btn-outline cursor-pointer"
          >
            Choose Images
          </label>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Image Tips</h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Use high-quality images (at least 800x600px)</li>
            <li>• Show the product clearly from multiple angles</li>
            <li>• Ensure good lighting and background</li>
            <li>• First image will be used as the main thumbnail</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductImageManager;
