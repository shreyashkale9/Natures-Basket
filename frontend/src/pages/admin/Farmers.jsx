import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { Eye, Edit, Trash2, CheckCircle, XCircle, Pause, Play, MapPin } from 'lucide-react';

const Farmers = () => {
  const [filter, setFilter] = useState('all');
  const [selectedFarmers, setSelectedFarmers] = useState([]);
  const [showFarmerModal, setShowFarmerModal] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLandsModal, setShowLandsModal] = useState(false);
  const [selectedFarmerLands, setSelectedFarmerLands] = useState(null);
  const queryClient = useQueryClient();

  const { data: farmers, isLoading, error } = useQuery({
    queryKey: ['admin-farmers'],
    queryFn: adminApi.getFarmers,
  });

  // Fetch lands for selected farmer
  const { data: farmerLandsData, isLoading: landsLoading } = useQuery({
    queryKey: ['farmer-lands', selectedFarmerLands?._id],
    queryFn: () => adminApi.getLands({ farmerId: selectedFarmerLands?._id }),
    enabled: !!selectedFarmerLands,
  });

  const farmerLands = farmerLandsData?.lands || [];

  const verifyFarmerMutation = useMutation({
    mutationFn: (farmerId) => adminApi.verifyFarmer(farmerId),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-farmers']);
      toast.success('Farmer verified successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to verify farmer');
    }
  });

  const rejectFarmerMutation = useMutation({
    mutationFn: (farmerId) => adminApi.rejectFarmer(farmerId),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-farmers']);
      toast.success('Farmer rejected successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to reject farmer');
    }
  });

  // Land management mutations
  const approveLandMutation = useMutation({
    mutationFn: ({ landId, adminNotes }) => adminApi.approveLand(landId, adminNotes),
    onSuccess: () => {
      queryClient.invalidateQueries(['farmer-lands']);
      toast.success('Land approved successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to approve land');
    }
  });

  const rejectLandMutation = useMutation({
    mutationFn: ({ landId, adminNotes }) => adminApi.rejectLand(landId, adminNotes),
    onSuccess: () => {
      queryClient.invalidateQueries(['farmer-lands']);
      toast.success('Land rejected successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to reject land');
    }
  });

  const handleStatusUpdate = (farmerId, newStatus) => {
    if (newStatus === 'active') {
      verifyFarmerMutation.mutate(farmerId);
    } else if (newStatus === 'rejected') {
      rejectFarmerMutation.mutate(farmerId);
    }
  };

  const handleBulkStatusUpdate = (newStatus) => {
    selectedFarmers.forEach(farmerId => {
      if (newStatus === 'active') {
        verifyFarmerMutation.mutate(farmerId);
      } else if (newStatus === 'rejected') {
        rejectFarmerMutation.mutate(farmerId);
      }
    });
    setSelectedFarmers([]);
    toast.success(`Updated ${selectedFarmers.length} farmers to ${newStatus}`);
  };

  const handleSelectFarmer = (farmerId) => {
    setSelectedFarmers(prev => 
      prev.includes(farmerId) 
        ? prev.filter(id => id !== farmerId)
        : [...prev, farmerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFarmers.length === filteredFarmers.length) {
      setSelectedFarmers([]);
    } else {
      setSelectedFarmers(filteredFarmers.map(farmer => farmer._id));
    }
  };

  const handleViewFarmer = (farmer) => {
    setSelectedFarmer(farmer);
    setShowFarmerModal(true);
  };

  const handleViewLands = (farmer) => {
    setSelectedFarmerLands(farmer);
    setShowLandsModal(true);
  };

  const handleLandStatusUpdate = (landId, newStatus) => {
    if (newStatus === 'approved') {
      approveLandMutation.mutate({ landId, adminNotes: 'Approved by admin' });
    } else if (newStatus === 'rejected') {
      rejectLandMutation.mutate({ landId, adminNotes: 'Rejected by admin' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-medium">Error loading farmers</h3>
        <p className="text-red-600 mt-2">{error.message}</p>
      </div>
    );
  }

  // Safety check for farmers data
  if (!farmers || !Array.isArray(farmers)) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-yellow-800 font-medium">No farmers data available</h3>
        <p className="text-yellow-600 mt-2">Farmers data is not in the expected format.</p>
      </div>
    );
  }

  const filteredFarmers = Array.isArray(farmers) ? farmers.filter(farmer => {
    const matchesFilter = filter === 'all' || farmer.status === filter;
    const matchesSearch = searchTerm === '' || 
      farmer.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  }) : [];

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'yellow', text: 'Pending' },
      active: { color: 'green', text: 'Active' },
      suspended: { color: 'red', text: 'Suspended' },
      rejected: { color: 'gray', text: 'Rejected' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Farmers Management</h1>
            <p className="text-gray-600 mt-2">Manage farmer accounts and approvals</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search farmers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Filter by status:</span>
            <div className="flex space-x-2">
              {['all', 'pending', 'active', 'suspended', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                    filter === status
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedFarmers.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-700">
                {selectedFarmers.length} farmer(s) selected
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkStatusUpdate('active')}
                  className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Approve All
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('rejected')}
                  className="flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Reject All
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('suspended')}
                  className="flex items-center px-3 py-1 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700"
                >
                  <Pause className="w-4 h-4 mr-1" />
                  Suspend All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Farmers Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedFarmers.length === filteredFarmers.length && filteredFarmers.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Farmer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lands
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFarmers.map((farmer) => (
                <tr key={farmer._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedFarmers.includes(farmer._id)}
                      onChange={() => handleSelectFarmer(farmer._id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="text-green-600 font-medium">
                            {farmer.firstName?.charAt(0)}{farmer.lastName?.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {farmer.firstName} {farmer.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{farmer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {farmer.phone || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(farmer.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {farmer.productCount || 0} products
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      onClick={() => handleViewLands(farmer)}
                      className="flex items-center text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      View Lands
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(farmer.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewFarmer(farmer)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-lg hover:bg-blue-100"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {farmer.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(farmer._id, 'active')}
                            className="text-green-600 hover:text-green-900 bg-green-50 p-2 rounded-lg hover:bg-green-100"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(farmer._id, 'rejected')}
                            className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg hover:bg-red-100"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {farmer.status === 'active' && (
                        <button
                          onClick={() => handleStatusUpdate(farmer._id, 'suspended')}
                          className="text-yellow-600 hover:text-yellow-900 bg-yellow-50 p-2 rounded-lg hover:bg-yellow-100"
                          title="Suspend"
                        >
                          <Pause className="w-4 h-4" />
                        </button>
                      )}
                      {farmer.status === 'suspended' && (
                        <button
                          onClick={() => handleStatusUpdate(farmer._id, 'active')}
                          className="text-green-600 hover:text-green-900 bg-green-50 p-2 rounded-lg hover:bg-green-100"
                          title="Reactivate"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Farmer Details Modal */}
      {showFarmerModal && selectedFarmer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Farmer Details</h3>
                <button
                  onClick={() => setShowFarmerModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <p className="text-gray-900">{selectedFarmer.firstName} {selectedFarmer.lastName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <p className="text-gray-900">{selectedFarmer.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <p className="text-gray-900">{selectedFarmer.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    {getStatusBadge(selectedFarmer.status)}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Joined Date</label>
                    <p className="text-gray-900">{new Date(selectedFarmer.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Products</label>
                    <p className="text-gray-900">{selectedFarmer.productCount || 0}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-4 pt-6 border-t border-gray-200">
                  {selectedFarmer.status === 'pending' && (
                    <>
                      <button
                        onClick={() => {
                          handleStatusUpdate(selectedFarmer._id, 'active');
                          setShowFarmerModal(false);
                        }}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve Farmer
                      </button>
                      <button
                        onClick={() => {
                          handleStatusUpdate(selectedFarmer._id, 'rejected');
                          setShowFarmerModal(false);
                        }}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject Farmer
                      </button>
                    </>
                  )}
                  {selectedFarmer.status === 'active' && (
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedFarmer._id, 'suspended');
                        setShowFarmerModal(false);
                      }}
                      className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      Suspend Farmer
                    </button>
                  )}
                  {selectedFarmer.status === 'suspended' && (
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedFarmer._id, 'active');
                        setShowFarmerModal(false);
                      }}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Reactivate Farmer
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Farmer Lands Modal */}
      {showLandsModal && selectedFarmerLands && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Lands for {selectedFarmerLands.firstName} {selectedFarmerLands.lastName}
                </h3>
                <button
                  onClick={() => {
                    setShowLandsModal(false);
                    setSelectedFarmerLands(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {landsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="space-y-4">
                  {farmerLands.length === 0 ? (
                    <div className="text-center py-12">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No lands found</h3>
                      <p className="text-gray-500">This farmer hasn't added any lands yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {farmerLands.map((land) => (
                        <div key={land._id} className="bg-gray-50 rounded-lg p-4 border">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 mb-1">{land.name}</h4>
                              <p className="text-sm text-gray-600">
                                {land.location?.city}, {land.location?.state}
                              </p>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              land.status === 'approved' ? 'bg-green-100 text-green-800' :
                              land.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              land.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {land.status}
                            </span>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Size:</span>
                              <span className="text-gray-900">{land.size?.area} {land.size?.unit}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Soil Type:</span>
                              <span className="text-gray-900">{land.soilType}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Water Source:</span>
                              <span className="text-gray-900">{land.waterSource}</span>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <button
                              onClick={() => window.open(`/lands/${land._id}`, '_blank')}
                              className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </button>
                            {land.status !== 'approved' && (
                              <button
                                onClick={() => handleLandStatusUpdate(land._id, 'approved')}
                                disabled={approveLandMutation.isPending}
                                className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </button>
                            )}
                            {land.status !== 'rejected' && (
                              <button
                                onClick={() => handleLandStatusUpdate(land._id, 'rejected')}
                                disabled={rejectLandMutation.isPending}
                                className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Farmers;