import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { landApi } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { MapPin, Droplets, Sun, Leaf, Search, Filter } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import PublicLayout from '../../components/layout/PublicLayout';

const Lands = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedSoilType, setSelectedSoilType] = useState('');

  const { data: lands, isLoading, error } = useQuery({
    queryKey: ['lands', { search: searchTerm, state: selectedState, soilType: selectedSoilType }],
    queryFn: () => landApi.getLands({
      search: searchTerm,
      state: selectedState,
      soilType: selectedSoilType,
      status: 'approved'
    }),
  });

  const filteredLands = lands?.filter(land => 
    land.status === 'approved' && land.isApproved
  ) || [];

  const getStatusColor = (status, isApproved) => {
    if (status === 'approved' && isApproved) return 'bg-green-100 text-green-800';
    if (status === 'pending') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusText = (status, isApproved) => {
    if (status === 'approved' && isApproved) return 'Approved';
    if (status === 'pending') return 'Pending';
    return 'Rejected';
  };

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Farm Lands</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover organic and sustainable farming lands across India. Connect with farmers and learn about their agricultural practices.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search lands..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="input w-full"
              >
                <option value="">All States</option>
                <option value="Delhi">Delhi</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Kerala">Kerala</option>
                <option value="Punjab">Punjab</option>
                <option value="Haryana">Haryana</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Rajasthan">Rajasthan</option>
              </select>
              <select
                value={selectedSoilType}
                onChange={(e) => setSelectedSoilType(e.target.value)}
                className="input w-full"
              >
                <option value="">All Soil Types</option>
                <option value="clay">Clay</option>
                <option value="sandy">Sandy</option>
                <option value="loamy">Loamy</option>
                <option value="silty">Silty</option>
                <option value="peaty">Peaty</option>
                <option value="chalky">Chalky</option>
              </select>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedState('');
                  setSelectedSoilType('');
                }}
                className="btn-outline flex items-center justify-center"
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredLands.length} approved land{filteredLands.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Lands Grid */}
          {filteredLands.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Lands Found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedState || selectedSoilType
                  ? 'Try adjusting your search criteria'
                  : 'No approved lands available at the moment'}
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedState('');
                  setSelectedSoilType('');
                }}
                className="btn-primary"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredLands.map((land) => (
                <div
                  key={land._id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                  onClick={() => navigate(`/lands/${land._id}`)}
                >
                  {/* Land Image */}
                  <div className="aspect-video bg-gray-100 relative">
                    {land.images && land.images.length > 0 ? (
                      <img
                        src={land.images[0]}
                        alt={land.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MapPin className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(land.status, land.isApproved)}`}>
                        {getStatusText(land.status, land.isApproved)}
                      </span>
                    </div>
                  </div>

                  {/* Land Details */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{land.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{land.description}</p>

                    {/* Location */}
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        {land.location?.city}, {land.location?.state}
                      </span>
                    </div>

                    {/* Size and Soil */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Droplets className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          {land.size?.area} {land.size?.unit}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Leaf className="w-4 h-4 mr-2" />
                        <span className="text-sm capitalize">{land.soilType}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {land.organic && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Organic
                        </span>
                      )}
                      {land.facilities && land.facilities.length > 0 && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {land.facilities.length} Facilities
                        </span>
                      )}
                      {land.crops && land.crops.length > 0 && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                          {land.crops.length} Crops
                        </span>
                      )}
                    </div>

                    {/* View Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/lands/${land._id}`);
                      }}
                      className="w-full btn-primary"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Call to Action */}
          <div className="text-center mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Interested in Farming?</h2>
            <p className="text-gray-600 mb-6">
              Join our community of farmers and start your sustainable farming journey.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/register')}
                className="btn-primary"
              >
                Register as Farmer
              </button>
              <button
                onClick={() => navigate('/products')}
                className="btn-outline"
              >
                Browse Products
              </button>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Lands;
