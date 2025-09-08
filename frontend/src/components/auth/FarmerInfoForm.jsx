import { MapPin, FileText } from 'lucide-react';

const FarmerInfoForm = ({ register, errors, selectedRole }) => {
  if (selectedRole !== 'farmer') return null;

  return (
    <>
      {/* Farm Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Farm Location *
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            {...register('farmLocation', { 
              required: selectedRole === 'farmer' ? 'Farm location is required' : false
            })}
            className="input pl-10"
            placeholder="e.g., Organic Valley Farm, California"
          />
        </div>
        {errors.farmLocation && (
          <p className="text-red-500 text-sm mt-1">{errors.farmLocation.message}</p>
        )}
      </div>

      {/* Farm Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Farm Description
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <textarea
            {...register('farmDescription')}
            className="input pl-10 min-h-[80px] resize-none"
            placeholder="Tell us about your farm, farming practices, and what you grow..."
            rows={3}
          />
        </div>
      </div>
    </>
  );
};

export default FarmerInfoForm;
