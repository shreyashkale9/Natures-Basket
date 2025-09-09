import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Leaf, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const [selectedRole, setSelectedRole] = useState('customer');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loginLoading } = useAuth();
  
  // Get role from URL params
  useEffect(() => {
    const role = searchParams.get('role');
    if (role && ['customer', 'farmer', 'admin'].includes(role)) {
      setSelectedRole(role);
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const roles = [
    { id: 'customer', name: 'Customer', description: 'Buy fresh organic vegetables' },
    { id: 'farmer', name: 'Farmer', description: 'Sell your organic produce' },
    { id: 'admin', name: 'Admin', description: 'Manage the platform' },
  ];

  const demoCredentials = {
    customer: { email: 'customer@example.com', password: 'customer123' },
    farmer: { email: 'farmer@example.com', password: 'farmer123' },
    admin: { email: 'admin@naturesbasket.com', password: 'admin123' },
  };

  const onSubmit = (data) => {
    login({ ...data, role: selectedRole });
  };

  const fillDemoCredentials = () => {
    const credentials = demoCredentials[selectedRole];
    if (credentials) {
      // This would need to be implemented with form refs or state management
      console.log('Demo credentials:', credentials);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Nature's Basket</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">
            {selectedRole === 'farmer' ? 'Farmer Login' : 
             selectedRole === 'admin' ? 'Admin Login' : 'Customer Login'}
          </h2>
          <p className="mt-2 text-gray-600">
            {selectedRole === 'farmer' ? 'Sign in to manage your farm products' :
             selectedRole === 'admin' ? 'Sign in to manage the platform' :
             'Sign in to browse and order fresh produce'}
          </p>
        </div>

        {/* Role Selection */}
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              I am a:
            </label>
            <div className="grid grid-cols-3 gap-3">
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    selectedRole === role.id
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm font-medium">{role.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{role.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className={`input w-full ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : ''
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  className={`input w-full pr-10 ${
                    errors.password ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Demo Credentials */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Demo Credentials for {roles.find(r => r.id === selectedRole)?.name}:</strong>
              </p>
              <p className="text-xs text-gray-500 font-mono">
                Email: {demoCredentials[selectedRole]?.email}
              </p>
              <p className="text-xs text-gray-500 font-mono">
                Password: {demoCredentials[selectedRole]?.password}
              </p>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="btn-primary w-full py-3 text-base font-medium"
            >
              {loginLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            to="/"
            className="text-sm text-gray-600 hover:text-gray-900 font-medium"
          >
            ← Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
