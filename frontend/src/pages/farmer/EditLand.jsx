import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { landApi } from '../../services/api';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save, MapPin, Droplets, Sun, Leaf } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const EditLand = () => {
  const navigate = useNavigate();
  const { landId } = useParams();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: {
      address: '',
      city: '',
      state: '',
      pincode: ''
    },
    size: {
      area: '',
      unit: 'acres'
    },
    soilType: 'loamy',
    waterSource: 'well',
    irrigation: 'manual',
    organic: false,
    certification: 'conventional',
    crops: [],
    facilities: []
  });

  const { data: land, isLoading, error } = useQuery({
    queryKey: ['land', landId],
    queryFn: () => landApi.getLand(landId),
    enabled: !!landId,
  });

  const updateLandMutation = useMutation({
    mutationFn: (data) => landApi.updateLand(landId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['farmerLands']);
      queryClient.invalidateQueries(['land', landId]);
      toast.success('Land updated successfully!');
      navigate('/farmer/lands');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update land');
    }
  });

  useEffect(() => {
    if (land) {
      setFormData({
        name: land.name || '',
        description: land.description || '',
        location: {
          address: land.location?.address || '',
          city: land.location?.city || '',
          state: land.location?.state || '',
          pincode: land.location?.pincode || ''
        },
        size: {
          area: land.size?.area || '',
          unit: land.size?.unit || 'acres'
        },
        soilType: land.soilType || 'loamy',
        waterSource: land.waterSource || 'well',
        irrigation: land.irrigation || 'manual',
        organic: land.organic || false,
        certification: land.certification || 'conventional',
        crops: land.crops || [],
        facilities: land.facilities || []
      });
    }
  }, [land]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleCropChange = (index, field, value) => {
    const newCrops = [...formData.crops];
    newCrops[index] = { ...newCrops[index], [field]: value };
    setFormData(prev => ({ ...prev, crops: newCrops }));
  };

  const addCrop = () => {
    setFormData(prev => ({
      ...prev,
      crops: [...prev.crops, { name: '', season: 'kharif', yield: '', unit: 'kg' }]
    }));
  };

  const removeCrop = (index) => {
    setFormData(prev => ({
      ...prev,
      crops: prev.crops.filter((_, i) => i !== index)
    }));
  };

  const handleFacilityChange = (facility) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateLandMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Land</h2>
          <p className="text-gray-600 mb-6">{error.message}</p>
          <button
            onClick={() => navigate('/farmer/lands')}
            className="btn-primary"
          >
            Back to Lands
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/farmer/lands')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Lands
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Land</h1>
          <p className="text-gray-600 mt-2">Update your land information</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-green-600" />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Land Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Soil Type *
                  </label>
                  <select
                    name="soilType"
                    value={formData.soilType}
                    onChange={handleInputChange}
                    className="input w-full"
                    required
                  >
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
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="input w-full"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-green-600" />
                Location
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="location.address"
                    value={formData.location.address}
                    onChange={handleInputChange}
                    className="input w-full"
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
                    value={formData.location.city}
                    onChange={handleInputChange}
                    className="input w-full"
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
                    value={formData.location.state}
                    onChange={handleInputChange}
                    className="input w-full"
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
                    value={formData.location.pincode}
                    onChange={handleInputChange}
                    className="input w-full"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Size and Water */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Droplets className="w-5 h-5 mr-2 text-green-600" />
                Size & Water Source
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area *
                  </label>
                  <input
                    type="number"
                    name="size.area"
                    value={formData.size.area}
                    onChange={handleInputChange}
                    className="input w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit *
                  </label>
                  <select
                    name="size.unit"
                    value={formData.size.unit}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Water Source *
                  </label>
                  <select
                    name="waterSource"
                    value={formData.waterSource}
                    onChange={handleInputChange}
                    className="input w-full"
                    required
                  >
                    <option value="well">Well</option>
                    <option value="borewell">Borewell</option>
                    <option value="canal">Canal</option>
                    <option value="river">River</option>
                    <option value="rainwater">Rainwater</option>
                    <option value="municipal">Municipal</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Irrigation Method *
                </label>
                <select
                  name="irrigation"
                  value={formData.irrigation}
                  onChange={handleInputChange}
                  className="input w-full"
                  required
                >
                  <option value="drip">Drip</option>
                  <option value="sprinkler">Sprinkler</option>
                  <option value="flood">Flood</option>
                  <option value="manual">Manual</option>
                  <option value="none">None</option>
                </select>
              </div>
            </div>

            {/* Organic Certification */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Leaf className="w-5 h-5 mr-2 text-green-600" />
                Organic Certification
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="organic"
                    checked={formData.organic}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Organic Farming
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certification
                  </label>
                  <select
                    name="certification"
                    value={formData.certification}
                    onChange={handleInputChange}
                    className="input w-full"
                  >
                    <option value="organic">Organic</option>
                    <option value="natural">Natural</option>
                    <option value="conventional">Conventional</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Facilities */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Sun className="w-5 h-5 mr-2 text-green-600" />
                Facilities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['storage', 'processing', 'packaging', 'transport', 'electricity', 'fencing', 'other'].map((facility) => (
                  <label key={facility} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.facilities.includes(facility)}
                      onChange={() => handleFacilityChange(facility)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-900 capitalize">{facility}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Crops */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Leaf className="w-5 h-5 mr-2 text-green-600" />
                Crops Grown
              </h2>
              {formData.crops.map((crop, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border border-gray-200 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Crop Name
                    </label>
                    <input
                      type="text"
                      value={crop.name}
                      onChange={(e) => handleCropChange(index, 'name', e.target.value)}
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yield
                    </label>
                    <input
                      type="number"
                      value={crop.yield}
                      onChange={(e) => handleCropChange(index, 'yield', e.target.value)}
                      className="input w-full"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeCrop(index)}
                      className="btn-outline text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addCrop}
                className="btn-outline"
              >
                Add Crop
              </button>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/farmer/lands')}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateLandMutation.isPending}
                className="btn-primary flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{updateLandMutation.isPending ? 'Updating...' : 'Update Land'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditLand;
