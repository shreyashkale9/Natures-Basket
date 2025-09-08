import { motion } from 'framer-motion';
import { RefreshCw, Upload, X, Image as ImageIcon, MapPin, Droplets, Sun } from 'lucide-react';

const CreateLandModal = ({ 
  showCreateForm, 
  setShowCreateForm, 
  newLand, 
  setNewLand, 
  handleSubmit, 
  createLandMutation,
  handleImageUpload,
  handleImageRemove
}) => {
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setNewLand(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setNewLand(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleCropAdd = () => {
    setNewLand(prev => ({
      ...prev,
      crops: [...prev.crops, { name: '', season: 'kharif', yield: '', unit: 'kg' }]
    }));
  };

  const handleCropRemove = (index) => {
    setNewLand(prev => ({
      ...prev,
      crops: prev.crops.filter((_, i) => i !== index)
    }));
  };

  const handleCropChange = (index, field, value) => {
    setNewLand(prev => ({
      ...prev,
      crops: prev.crops.map((crop, i) => 
        i === index ? { ...crop, [field]: value } : crop
      )
    }));
  };

  const handleFacilityToggle = (facility) => {
    setNewLand(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  if (!showCreateForm) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Add New Land</h3>
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
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Land Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={newLand.name}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="e.g., North Field, Organic Farm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Soil Type *
                </label>
                <select 
                  name="soilType"
                  value={newLand.soilType}
                  onChange={handleInputChange}
                  className="input w-full"
                  required
                >
                  <option value="">Select Soil Type</option>
                  <option value="clay">Clay</option>
                  <option value="sandy">Sandy</option>
                  <option value="loamy">Loamy</option>
                  <option value="silty">Silty</option>
                  <option value="peaty">Peaty</option>
                  <option value="chalky">Chalky</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={newLand.description}
                onChange={handleInputChange}
                rows={3}
                className="input w-full"
                placeholder="Describe your land, its features, and farming practices..."
                required
              />
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Location Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="location.address"
                    value={newLand.location.address}
                    onChange={handleInputChange}
                    className="input w-full"
                    placeholder="Street address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="location.city"
                    value={newLand.location.city}
                    onChange={handleInputChange}
                    className="input w-full"
                    placeholder="City"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="location.state"
                    value={newLand.location.state}
                    onChange={handleInputChange}
                    className="input w-full"
                    placeholder="State"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="location.pincode"
                    value={newLand.location.pincode}
                    onChange={handleInputChange}
                    className="input w-full"
                    placeholder="6-digit pincode"
                    pattern="[0-9]{6}"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Size */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area *
                </label>
                <input
                  type="number"
                  name="size.area"
                  value={newLand.size.area}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0.01"
                  className="input w-full"
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit *
                </label>
                <select 
                  name="size.unit"
                  value={newLand.size.unit}
                  onChange={handleInputChange}
                  className="input w-full"
                  required
                >
                  <option value="acres">Acres</option>
                  <option value="hectares">Hectares</option>
                  <option value="sqft">Square Feet</option>
                  <option value="sqm">Square Meters</option>
                </select>
              </div>
            </div>

            {/* Water and Irrigation */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900 flex items-center">
                <Droplets className="w-4 h-4 mr-2" />
                Water & Irrigation
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Water Source *
                  </label>
                  <select 
                    name="waterSource"
                    value={newLand.waterSource}
                    onChange={handleInputChange}
                    className="input w-full"
                    required
                  >
                    <option value="">Select Water Source</option>
                    <option value="well">Well</option>
                    <option value="borewell">Borewell</option>
                    <option value="canal">Canal</option>
                    <option value="river">River</option>
                    <option value="rainwater">Rainwater</option>
                    <option value="municipal">Municipal</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Irrigation Method *
                  </label>
                  <select 
                    name="irrigation"
                    value={newLand.irrigation}
                    onChange={handleInputChange}
                    className="input w-full"
                    required
                  >
                    <option value="">Select Irrigation</option>
                    <option value="drip">Drip Irrigation</option>
                    <option value="sprinkler">Sprinkler</option>
                    <option value="flood">Flood Irrigation</option>
                    <option value="manual">Manual</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Land Images (Max 5)
              </label>
              
              {/* Upload Button */}
              <div className="mb-4">
                <input
                  type="file"
                  id="land-image-upload"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="land-image-upload"
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
              {newLand.images && newLand.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {newLand.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={image.preview}
                          alt={`Land preview ${index + 1}`}
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
              {(!newLand.images || newLand.images.length === 0) && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No images uploaded yet</p>
                  <p className="text-xs text-gray-400">Click "Upload Images" to add land photos</p>
                </div>
              )}
            </div>

            {/* Crops */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-md font-medium text-gray-900 flex items-center">
                  <Sun className="w-4 h-4 mr-2" />
                  Crops Grown
                </h4>
                <button
                  type="button"
                  onClick={handleCropAdd}
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  + Add Crop
                </button>
              </div>
              
              {newLand.crops.map((crop, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Crop Name
                    </label>
                    <input
                      type="text"
                      value={crop.name}
                      onChange={(e) => handleCropChange(index, 'name', e.target.value)}
                      className="input w-full"
                      placeholder="e.g., Rice, Wheat"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Season
                    </label>
                    <select 
                      value={crop.season}
                      onChange={(e) => handleCropChange(index, 'season', e.target.value)}
                      className="input w-full"
                    >
                      <option value="kharif">Kharif</option>
                      <option value="rabi">Rabi</option>
                      <option value="zaid">Zaid</option>
                      <option value="year-round">Year Round</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Yield
                    </label>
                    <input
                      type="number"
                      value={crop.yield}
                      onChange={(e) => handleCropChange(index, 'yield', e.target.value)}
                      className="input w-full"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-end">
                    <select 
                      value={crop.unit}
                      onChange={(e) => handleCropChange(index, 'unit', e.target.value)}
                      className="input w-full mr-2"
                    >
                      <option value="kg">kg</option>
                      <option value="quintal">quintal</option>
                      <option value="tonne">tonne</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => handleCropRemove(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Facilities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Facilities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['storage', 'processing', 'packaging', 'transport', 'electricity', 'fencing', 'other'].map((facility) => (
                  <label key={facility} className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={newLand.facilities.includes(facility)}
                      onChange={() => handleFacilityToggle(facility)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500" 
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">{facility}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Organic and Certification */}
            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  name="organic"
                  checked={newLand.organic}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500" 
                />
                <span className="ml-2 text-sm text-gray-700">Organic Farming</span>
              </label>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certification
                </label>
                <select 
                  name="certification"
                  value={newLand.certification}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="conventional">Conventional</option>
                  <option value="organic">Organic Certified</option>
                  <option value="natural">Natural</option>
                  <option value="none">None</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="btn-outline"
                disabled={createLandMutation.isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex items-center space-x-2"
                disabled={createLandMutation.isPending}
              >
                {createLandMutation.isPending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Create Land</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateLandModal;
