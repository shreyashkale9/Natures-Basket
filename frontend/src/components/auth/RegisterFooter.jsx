import { Link } from 'react-router-dom';
import LoadingSpinner from '../ui/LoadingSpinner';

const RegisterFooter = ({ selectedRole, isPending }) => {
  return (
    <>
      {/* Submit Button */}
      <div className="mt-6">
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary w-full"
        >
          {isPending ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="sm" className="mr-2" />
              Creating Account...
            </div>
          ) : (
            `Create ${selectedRole === 'farmer' ? 'Farmer' : 'Customer'} Account`
          )}
        </button>
      </div>

      {/* Terms and Privacy */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-primary-600 hover:text-primary-500">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-primary-600 hover:text-primary-500">
            Privacy Policy
          </a>
        </p>
      </div>

      {/* Login Link */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in here
          </Link>
        </p>
      </div>
    </>
  );
};

export default RegisterFooter;
