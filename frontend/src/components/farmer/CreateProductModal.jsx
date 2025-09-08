import { motion } from 'framer-motion';
import { RefreshCw, Upload, X, Image as ImageIcon, MapPin } from 'lucide-react';

const CreateProductModal = ({ 
  showCreateForm, 
  setShowCreateForm, 
  newProduct, 
  setNewProduct, 
  handleSubmit, 
  createProductMutation,
  handleImageUpload,
  handleImageRemove,
  lands
}) => {
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (!showCreateForm) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Add New Product</h3>
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="e.g., Fresh Organic Tomatoes"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select 
                  name="category"
                  value={newProduct.category}
                  onChange={handleInputChange}
                  className="input w-full"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="fruits">Fruits</option>
                  <option value="herbs">Herbs</option>
                  <option value="organic">Organic</option>
                </select>
              </div>
            </div>

            {/* Land Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Select Land *
              </label>
              {lands.length === 0 ? (
                <div className="border-2 border-dashed border-red-300 rounded-lg p-4 text-center bg-red-50">
                  <MapPin className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <p className="text-sm text-red-600 font-medium">No lands found</p>
                  <p className="text-xs text-red-500 mt-1">You need to create at least one land before creating products.</p>
                  <a
                    href="/farmer/lands"
                    className="inline-block mt-2 text-sm text-red-600 hover:text-red-700 underline"
                  >
                    Go to Lands Management
                  </a>
                </div>
              ) : (
                <div>
                  <select 
                    name="land"
                    value={newProduct.land}
                    onChange={handleInputChange}
                    className="input w-full"
                    required
                  >
                    <option value="">Select Land</option>
                    {lands
                      .filter(land => land.status === 'approved' && land.isApproved)
                      .map(land => (
                        <option key={land._id} value={land._id}>
                          {land.name} - {land.location?.city}, {land.location?.state} ({land.size?.area} {land.size?.unit})
                        </option>
                      ))}
                  </select>
                  
                  {/* Show land status information */}
                  {lands.filter(land => land.status === 'approved' && land.isApproved).length === 0 && lands.length > 0 && (
                    <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800 font-medium">No approved lands available</p>
                      <p className="text-xs text-yellow-700 mt-1">
                        You have {lands.length} land(s) but none are approved yet. 
                        Only approved lands can be used for product creation.
                      </p>
                      <div className="mt-2">
                        <p className="text-xs text-yellow-700 font-medium">Land Status:</p>
                        {lands.map(land => (
                          <p key={land._id} className="text-xs text-yellow-600">
                            • {land.name}: {land.status} {land.isApproved ? '(Approved)' : '(Pending Approval)'}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {lands.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Only approved lands are shown. Products can only be created for active lands.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="input w-full"
                  placeholder="4.99"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={newProduct.stock}
                  onChange={handleInputChange}
                  min="0"
                  className="input w-full"
                  placeholder="50"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit *
                </label>
                <select 
                  name="unit"
                  value={newProduct.unit}
                  onChange={handleInputChange}
                  className="input w-full"
                  required
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="pieces">Pieces</option>
                  <option value="bundle">Bundle</option>
                  <option value="lb">Pound (lb)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Order Quantity
                </label>
                <input
                  type="number"
                  name="minOrderQuantity"
                  value={newProduct.minOrderQuantity}
                  onChange={handleInputChange}
                  min="1"
                  className="input w-full"
                  placeholder="1"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                rows={4}
                className="input w-full"
                placeholder="Describe your product in detail..."
                required
              />
            </div>
            
            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images (Max 5)
              </label>
              
              {/* Upload Button */}
              <div className="mb-4">
                <input
                  type="file"
                  id="image-upload"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Images
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Upload up to 5 images (JPG, PNG, GIF)
                </p>
              </div>
              
              {/* Image Previews */}
              {newProduct.images && newProduct.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {newProduct.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={image.preview}
                          alt={`Product preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleImageRemove(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {image.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Empty State */}
              {(!newProduct.images || newProduct.images.length === 0) && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No images uploaded yet</p>
                  <p className="text-xs text-gray-400">Click "Upload Images" to add product photos</p>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  name="organic"
                  checked={newProduct.organic}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500" 
                />
                <span className="ml-2 text-sm text-gray-700">Organic Certified</span>
              </label>
              
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  name="fresh"
                  checked={newProduct.fresh}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500" 
                />
                <span className="ml-2 text-sm text-gray-700">Fresh Harvest</span>
              </label>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="btn-outline"
                disabled={createProductMutation.isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex items-center space-x-2"
                disabled={createProductMutation.isPending || lands.filter(land => land.status === 'approved' && land.isApproved).length === 0 || !newProduct.land}
              >
                {createProductMutation.isPending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Create Product</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateProductModal;
