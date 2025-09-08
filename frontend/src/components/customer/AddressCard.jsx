import { Edit, Trash2 } from 'lucide-react';

const AddressCard = ({ address, index }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-gray-900">
              {address.firstName} {address.lastName}
            </h3>
            {address.isDefault && (
              <span className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded-full">
                Default
              </span>
            )}
          </div>
          <p className="text-gray-600 mb-1">{address.address}</p>
          <p className="text-gray-600">
            {address.city}, {address.state} {address.zipCode}
          </p>
          <p className="text-gray-600">{address.phone}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="btn-outline text-sm">
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </button>
          <button className="btn-outline text-sm text-red-600 hover:bg-red-50 hover:border-red-300">
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
