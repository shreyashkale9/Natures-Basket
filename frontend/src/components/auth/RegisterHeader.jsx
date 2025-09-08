import { Link } from 'react-router-dom';
import { ArrowLeft, Leaf } from 'lucide-react';

const RegisterHeader = () => {
  return (
    <div className="text-center">
      <Link to="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Home
      </Link>
      
      <div className="mx-auto h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
        <Leaf className="h-6 w-6 text-primary-600" />
      </div>
      
      <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
      <p className="mt-2 text-sm text-gray-600">
        Join Natures-Basket to start your journey
      </p>
    </div>
  );
};

export default RegisterHeader;
