import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { landApi } from '../../services/api';
import { ArrowLeft, MapPin, Droplets, Sun, Leaf, Shield, Calendar, Settings, Edit } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';

const LandView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: land, isLoading, error } = useQuery({
    queryKey: ['land', id],
    queryFn: () => landApi.getLand(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !land) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Land Not Found</h2>
          <p className="text-gray-600 mb-6">The land you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/lands')}
            className="btn-primary"
          >
            Browse Lands
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user && user.role === 'farmer' && land.farmer?._id === user._id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Land Images */}
          <div className="space-y-4">
            {land.images && land.images.length > 0 ? (
              <div className="space-y-4">
                <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
                  <img
                    src={land.images[0]}
                    alt={land.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {land.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {land.images.slice(1, 5).map((image, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden bg-white shadow">
                        <img
                          src={image}
                          alt={`${land.name} ${index + 2}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-square rounded-2xl bg-gray-100 flex items-center justify-center">
                <MapPin className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>

          {/* Land Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  land.status === 'approved' && land.isApproved
                    ? 'bg-green-100 text-green-800'
                    : land.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {land.status === 'approved' && land.isApproved ? 'Available' : 
                   land.status === 'pending' ? 'Pending Approval' : 'Unavailable'}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{land.name}</h1>
              <p className="text-lg text-gray-600">{land.location?.city}, {land.location?.state}</p>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{land.description}</p>
            </div>

            {/* Land Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2">Size</h4>
                <p className="text-gray-600">{land.size?.area} {land.size?.unit}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2">Soil Type</h4>
                <p className="text-gray-600 capitalize">{land.soilType}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2">Water Source</h4>
                <p className="text-gray-600 capitalize">{land.waterSource}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2">Irrigation</h4>
                <p className="text-gray-600 capitalize">{land.irrigation}</p>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-green-600" />
                Location
              </h3>
              <div className="space-y-2">
                <p className="text-gray-700">{land.location?.address}</p>
                <p className="text-gray-600">
                  {land.location?.city}, {land.location?.state} - {land.location?.pincode}
                </p>
              </div>
            </div>

            {/* Facilities */}
            {land.facilities && land.facilities.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Facilities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {land.facilities.map((facility, index) => (
                    <div key={index} className="flex items-center text-green-600">
                      <Shield className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium capitalize">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Crops */}
            {land.crops && land.crops.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Leaf className="w-5 h-5 mr-2 text-green-600" />
                  Crops Grown
                </h3>
                <div className="space-y-3">
                  {land.crops.map((crop, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 capitalize">{crop.name}</h4>
                        <span className="text-sm text-gray-500 capitalize">{crop.season}</span>
                      </div>
                      {crop.yield && (
                        <p className="text-sm text-gray-600">
                          Yield: {crop.yield} {crop.unit}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Farmer Information */}
            {land.farmer && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Farmer</h3>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">{land.farmer.name}</p>
                  <p className="text-gray-600">{land.farmer.email}</p>
                  {land.farmer.phone && (
                    <p className="text-gray-600">{land.farmer.phone}</p>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-6 border-t border-gray-200">
              <div className="space-y-4">
                {/* Owner Actions */}
                {isOwner && (
                  <div className="flex space-x-4">
                    <button
                      onClick={() => navigate('/farmer/lands')}
                      className="btn-outline flex-1 flex items-center justify-center"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Manage Lands
                    </button>
                    <button
                      onClick={() => navigate(`/farmer/lands/${land._id}/edit`)}
                      className="btn-primary flex-1 flex items-center justify-center"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Land
                    </button>
                  </div>
                )}
                
                {/* General Actions */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => navigate('/lands')}
                    className="btn-outline flex-1"
                  >
                    Browse More Lands
                  </button>
                  <button
                    onClick={() => navigate('/products')}
                    className="btn-primary flex-1"
                  >
                    View Products from this Land
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandView;
