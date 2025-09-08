import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { MapPin, CheckCircle, XCircle, Clock, Eye, Search, Filter } from 'lucide-react';
import { adminApi } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Lands = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLands, setSelectedLands] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Fetch all lands
  const { data: landsData, isLoading, error } = useQuery({
    queryKey: ['adminLands', { search: searchTerm, status: statusFilter }],
    queryFn: () => adminApi.getLands({ 
      search: searchTerm, 
      status: statusFilter !== 'all' ? statusFilter : undefined 
    }),
  });

  const lands = landsData?.lands || [];

  // Approve land mutation
  const approveLandMutation = useMutation({
    mutationFn: ({ landId, adminNotes }) => adminApi.approveLand(landId, adminNotes),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminLands']);
      setSelectedLands([]);
      setShowBulkActions(false);
      toast.success('Land approved successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to approve land');
    }
  });

  // Reject land mutation
  const rejectLandMutation = useMutation({
    mutationFn: ({ landId, adminNotes }) => adminApi.rejectLand(landId, adminNotes),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminLands']);
      setSelectedLands([]);
      setShowBulkActions(false);
      toast.success('Land rejected successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to reject land');
    }
  });

  // Set land pending mutation
  const setLandPendingMutation = useMutation({
    mutationFn: ({ landId, adminNotes }) => adminApi.setLandPending(landId, adminNotes),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminLands']);
      setSelectedLands([]);
      setShowBulkActions(false);
      toast.success('Land set to pending successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update land status');
    }
  });

  const handleStatusUpdate = (landId, newStatus) => {
    if (newStatus === 'approved') {
      approveLandMutation.mutate({ landId, adminNotes: 'Approved by admin' });
    } else if (newStatus === 'rejected') {
      rejectLandMutation.mutate({ landId, adminNotes: 'Rejected by admin' });
    } else if (newStatus === 'pending') {
      setLandPendingMutation.mutate({ landId, adminNotes: 'Set to pending by admin' });
    }
  };

  const handleBulkStatusUpdate = (status) => {
    selectedLands.forEach(landId => {
      handleStatusUpdate(landId, status);
    });
  };

  const handleSelectLand = (landId) => {
    setSelectedLands(prev => 
      prev.includes(landId) 
        ? prev.filter(id => id !== landId)
        : [...prev, landId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLands.length === lands.length) {
      setSelectedLands([]);
    } else {
      setSelectedLands(lands.map(land => land._id));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'rejected':
        return XCircle;
      default:
        return Clock;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Lands</h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Land Management</h1>
          <p className="text-gray-600 mt-2">Review and approve land listings from farmers</p>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search lands by name, farmer, or location..."
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

        {/* Bulk Actions */}
        {selectedLands.length > 0 && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">
                {selectedLands.length} land(s) selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkStatusUpdate('approved')}
                  className="btn-sm bg-green-600 text-white hover:bg-green-700"
                  disabled={approveLandMutation.isPending}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Approve All
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('rejected')}
                  className="btn-sm bg-red-600 text-white hover:bg-red-700"
                  disabled={rejectLandMutation.isPending}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Reject All
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('pending')}
                  className="btn-sm bg-yellow-600 text-white hover:bg-yellow-700"
                  disabled={setLandPendingMutation.isPending}
                >
                  <Clock className="w-4 h-4 mr-1" />
                  Set Pending
                </button>
              </div>
            </div>
          </div>
        )}

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
                <CheckCircle className="w-6 h-6 text-green-600" />
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
                <Clock className="w-6 h-6 text-yellow-600" />
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
                <XCircle className="w-6 h-6 text-red-600" />
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
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedLands.length === lands.length && lands.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Land
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Farmer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lands.map((land) => {
                  const StatusIcon = getStatusIcon(land.status);
                  return (
                    <tr key={land._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedLands.includes(land._id)}
                          onChange={() => handleSelectLand(land._id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {land.thumbnail || (land.images && land.images.length > 0) ? (
                              <img
                                src={land.thumbnail || land.images[0]}
                                alt={land.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-green-600" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{land.name}</div>
                            <div className="text-sm text-gray-500">ID: {land._id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {land.farmer?.firstName} {land.farmer?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{land.farmer?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{land.location?.city}</div>
                        <div className="text-sm text-gray-500">{land.location?.state}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {land.size?.area} {land.size?.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(land.status)}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {land.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="w-4 h-4" />
                          </button>
                          {land.status !== 'active' && (
                            <button
                              onClick={() => handleStatusUpdate(land._id, 'approved')}
                              className="text-green-600 hover:text-green-900"
                              disabled={approveLandMutation.isPending}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {land.status !== 'rejected' && (
                            <button
                              onClick={() => handleStatusUpdate(land._id, 'rejected')}
                              className="text-red-600 hover:text-red-900"
                              disabled={rejectLandMutation.isPending}
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                          {land.status !== 'pending' && (
                            <button
                              onClick={() => handleStatusUpdate(land._id, 'pending')}
                              className="text-yellow-600 hover:text-yellow-900"
                              disabled={setLandPendingMutation.isPending}
                            >
                              <Clock className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {lands.length === 0 && (
              <div className="text-center py-12">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No lands found</h3>
                <p className="text-gray-500">No land listings match your current filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lands;
