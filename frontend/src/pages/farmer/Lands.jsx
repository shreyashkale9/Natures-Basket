import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Plus, MapPin, Search, Filter } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { landApi } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import LandsTable from '../../components/farmer/LandsTable';
import CreateLandModal from '../../components/farmer/CreateLandModal';

const Lands = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [newLand, setNewLand] = useState({
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
    images: [],
    crops: [],
    facilities: []
  });

  // Fetch farmer's lands
  const { data: landsData, isLoading: landsLoading, error: landsError } = useQuery({
    queryKey: ['farmerLands'],
    queryFn: () => landApi.getFarmerLands(),
    enabled: !!user
  });

  const lands = landsData?.lands || [];

  // Create land mutation
  const createLandMutation = useMutation({
    mutationFn: (landData) => landApi.createLand(landData),
    onSuccess: () => {
      queryClient.invalidateQueries(['farmerLands']);
      setShowCreateForm(false);
      setNewLand({
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
        images: [],
        crops: [],
        facilities: []
      });
      toast.success('Land created successfully! It will be reviewed by admin.');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create land');
    }
  });

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      toast.error('Please select valid image files');
      return;
    }
    
    if (newLand.images.length + imageFiles.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    
    // Convert files to base64 for preview
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewLand(prev => ({
          ...prev,
          images: [...prev.images, {
            file: file,
            preview: e.target.result,
            name: file.name
          }]
        }));
      };
      reader.readAsDataURL(file);
    });
  };
  
  // Handle image removal
  const handleImageRemove = (index) => {
    setNewLand(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare land data with images as base64 strings
    const landData = {
      ...newLand,
      images: newLand.images.map(img => img.preview), // Send base64 strings
      thumbnail: newLand.images.length > 0 ? newLand.images[0].preview : null // Use first image as thumbnail
    };
    
    createLandMutation.mutate(landData);
  };

  // Filter lands based on search and status
  const filteredLands = lands.filter(land => {
    const matchesSearch = land.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         land.location?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         land.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || land.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (landsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (landsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Lands</h2>
          <p className="text-gray-600">{landsError.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Lands</h1>
              <p className="text-gray-600 mt-2">Manage your land listings and track their status</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Land</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search lands by name, location, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Lands</p>
                <p className="text-2xl font-bold text-gray-900">{lands.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {lands.filter(land => land.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {lands.filter(land => land.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {lands.filter(land => land.status === 'rejected').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lands Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Land Listings</h2>
          </div>
          <div className="p-6">
            {filteredLands.length > 0 ? (
              <LandsTable lands={filteredLands} />
            ) : (
              <div className="text-center py-12">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || statusFilter !== 'all' ? 'No lands match your filters' : 'No lands found'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria.' 
                    : 'Start by adding your first land to get started.'}
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="btn-primary"
                  >
                    Add Your First Land
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <CreateLandModal
          showCreateForm={showCreateForm}
          setShowCreateForm={setShowCreateForm}
          newLand={newLand}
          setNewLand={setNewLand}
          handleSubmit={handleSubmit}
          createLandMutation={createLandMutation}
          handleImageUpload={handleImageUpload}
          handleImageRemove={handleImageRemove}
        />
      </div>
    </div>
  );
};

export default Lands;
