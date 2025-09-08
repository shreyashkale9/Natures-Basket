import { MapPin } from 'lucide-react';
import AddressCard from './AddressCard';

const AddressesTab = ({ user }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Shipping Addresses</h2>
        <button className="btn-primary">
          <MapPin className="w-4 h-4 mr-2" />
          Add Address
        </button>
      </div>

      <div className="space-y-4">
        {user?.addresses && user.addresses.length > 0 ? (
          user.addresses.map((address, index) => (
            <AddressCard key={index} address={address} index={index} />
          ))
        ) : (
          <div className="text-center py-8">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
            <p className="text-gray-600 mb-4">
              Add a shipping address to make checkout faster
            </p>
            <button className="btn-primary">
              Add Your First Address
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressesTab;
