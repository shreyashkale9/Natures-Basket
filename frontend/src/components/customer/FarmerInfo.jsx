import { MapPin, Leaf, Shield } from 'lucide-react';

const FarmerInfo = ({ product }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Farmer Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Farm Details</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{product.farmName || 'Local Organic Farm'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Leaf className="w-4 h-4" />
                <span>{product.isOrganic ? 'Certified Organic' : 'Conventional Farming'}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Certifications</h4>
            <div className="space-y-2 text-sm text-gray-600">
              {product.organicCertification ? (
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>{product.organicCertification}</span>
                </div>
              ) : (
                <span className="text-gray-500">No certifications listed</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Product Details</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div>Harvest Date: {product.harvestDate ? new Date(product.harvestDate).toLocaleDateString() : 'Not specified'}</div>
              <div>Expiry Date: {product.expiryDate ? new Date(product.expiryDate).toLocaleDateString() : 'Not specified'}</div>
              <div>Unit: {product.unit}</div>
              <div>Available: {product.quantity} {product.unit}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerInfo;
