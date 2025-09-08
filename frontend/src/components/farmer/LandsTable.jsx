import { motion } from 'framer-motion';
import { MapPin, CheckCircle, Clock, AlertCircle, Eye, Edit, Trash2, Droplets, Sun } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { landApi } from '../../services/api';
import { toast } from 'react-hot-toast';
import ConfirmationModal from '../ui/ConfirmationModal';

const LandsTable = ({ lands }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, land: null });

  // Delete land mutation
  const deleteLandMutation = useMutation({
    mutationFn: (landId) => landApi.deleteLand(landId),
    onSuccess: () => {
      queryClient.invalidateQueries(['farmerLands']);
      toast.success('Land deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete land');
    }
  });

  const handleViewLand = (land) => {
    // Navigate to land detail page
    navigate(`/lands/${land._id}`);
  };

  const handleEditLand = (land) => {
    // Navigate to edit land page
    navigate(`/farmer/lands/${land._id}/edit`);
  };

  const handleDeleteLand = (land) => {
    setDeleteModal({ isOpen: true, land });
  };

  const confirmDelete = () => {
    if (deleteModal.land) {
      deleteLandMutation.mutate(deleteModal.land._id);
      setDeleteModal({ isOpen: false, land: null });
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, land: null });
  };
  const getStatusColor = (land) => {
    if (land.status === 'approved' && land.isApproved) {
      return 'bg-green-100 text-green-800';
    } else if (land.status === 'pending') {
      return 'bg-yellow-100 text-yellow-800';
    } else if (land.status === 'rejected') {
      return 'bg-red-100 text-red-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (land) => {
    if (land.status === 'approved' && land.isApproved) {
      return CheckCircle;
    } else if (land.status === 'pending') {
      return Clock;
    } else if (land.status === 'rejected') {
      return AlertCircle;
    } else {
      return Clock;
    }
  };

  const getStatusText = (land) => {
    if (land.status === 'approved' && land.isApproved) {
      return 'Approved';
    } else if (land.status === 'pending') {
      return 'Pending';
    } else if (land.status === 'rejected') {
      return 'Rejected';
    } else {
      return 'Inactive';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Land
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Size
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Soil Type
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
          {lands.map((land, index) => {
            const StatusIcon = getStatusIcon(land);
            return (
              <motion.tr
                key={land.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="hover:bg-gray-50"
              >
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
                      <div className="text-sm text-gray-500">ID: {land.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{land.location?.city}</div>
                  <div className="text-sm text-gray-500">{land.location?.state}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {land.size?.area} {land.size?.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                    {land.soilType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(land)}`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {getStatusText(land)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleViewLand(land)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                      title="View land details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleEditLand(land)}
                      className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                      title="Edit land"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteLand(land)}
                      disabled={deleteLandMutation.isPending}
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete land"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
      
      {lands.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No lands found</h3>
          <p className="text-gray-500">Start by adding your first land to get started.</p>
        </div>
      )}
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Land"
        message={`Are you sure you want to delete "${deleteModal.land?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default LandsTable;
