import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Camera } from 'lucide-react';

const ProfileCard = ({ user }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-soft p-6"
    >
      <div className="text-center">
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <User className="w-12 h-12 text-gray-400" />
            )}
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        
        <h2 className="text-xl font-bold text-gray-900">
          {user?.firstName} {user?.lastName}
        </h2>
        <p className="text-gray-600 mb-2">Farmer</p>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center justify-center space-x-2">
            <Mail className="w-4 h-4" />
            <span>{user?.email}</span>
          </div>
          {user?.phone && (
            <div className="flex items-center justify-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>{user.phone}</span>
            </div>
          )}
          {user?.farmLocation && (
            <div className="flex items-center justify-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>{user.farmLocation}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
