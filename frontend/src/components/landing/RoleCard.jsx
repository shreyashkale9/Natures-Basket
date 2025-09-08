import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Users, Leaf, Shield } from 'lucide-react';

const RoleCard = ({ 
  role, 
  icon: Icon, 
  iconBg, 
  iconColor, 
  title, 
  description, 
  benefits, 
  buttonText, 
  buttonClass, 
  loginLink, 
  delay 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-medium transition-shadow"
    >
      <div className={`w-16 h-16 ${iconBg} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
        <Icon className={`w-8 h-8 ${iconColor}`} />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
        {title}
      </h3>
      <p className="text-gray-600 mb-6 text-center">
        {description}
      </p>
      <ul className="space-y-3 mb-8">
        {benefits.map((benefit) => (
          <li key={benefit} className="flex items-center">
            <CheckCircle className={`w-5 h-5 ${iconColor} mr-3 flex-shrink-0`} />
            <span className="text-gray-700">{benefit}</span>
          </li>
        ))}
      </ul>
      <Link
        to={role === 'admin' ? '/login' : '/register'}
        className={`${buttonClass} w-full justify-center`}
      >
        {buttonText}
      </Link>
      <div className="mt-3 text-center">
        <Link
          to={loginLink}
          className={`text-sm ${iconColor} hover:opacity-80`}
        >
          {role === 'admin' ? 'Admin access only' : 'Already have an account? Login'}
        </Link>
      </div>
    </motion.div>
  );
};

export default RoleCard;
