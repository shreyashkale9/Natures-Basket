import { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem('token');
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    
    // Check if token is expired
    if (storedToken && tokenExpiry) {
      const now = new Date().getTime();
      if (now > parseInt(tokenExpiry)) {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
        return null;
      }
    }
    
    return storedToken;
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch user profile when token exists
  const { data: userData, isLoading: userLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: () => authApi.getMe(),
    enabled: !!token,
    retry: false,
    onError: (error) => {
      console.log('Auth error:', error);
      // If token is invalid, clear it
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiry');
      setToken(null);
      setUser(null);
    },
  });

  useEffect(() => {
    if (userData?.user) {
      setUser(userData.user);
      setLoading(false);
    } else if (error) {
      setLoading(false);
    } else if (!token) {
      setLoading(false);
    }
  }, [userData, error, token]);

  // Auto-logout when token expires
  useEffect(() => {
    if (token) {
      const tokenExpiry = localStorage.getItem('tokenExpiry');
      if (tokenExpiry) {
        const expiryTime = parseInt(tokenExpiry) - new Date().getTime();
        if (expiryTime > 0) {
          const timeout = setTimeout(() => {
            logout();
            toast.error('Session expired. Please log in again.');
          }, expiryTime);
          
          return () => clearTimeout(timeout);
        }
      }
    }
  }, [token]);

  const loginMutation = useMutation({
    mutationFn: (credentials) => authApi.login(credentials),
    onSuccess: (data) => {
      const { token: newToken, user: userData } = data;
      
      // Set token with 45-minute expiry for admin, 24 hours for others
      const expiryTime = userData.role === 'admin' ? 45 * 60 * 1000 : 24 * 60 * 60 * 1000; // 45 minutes for admin, 24 hours for others
      const expiryDate = new Date().getTime() + expiryTime;
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('tokenExpiry', expiryDate.toString());
      setToken(newToken);
      setUser(userData);
      
      // Redirect based on role
      const roleRoutes = {
        customer: '/products',
        farmer: '/farmer',
        admin: '/admin',
      };
      
      const redirectPath = roleRoutes[userData.role] || '/';
      navigate(redirectPath);
      
      toast.success(`Welcome back, ${userData.firstName} ${userData.lastName}!`);
      queryClient.invalidateQueries(['user']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData) => authApi.register(userData),
    onSuccess: (data) => {
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    },
  });

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    setToken(null);
    setUser(null);
    queryClient.clear();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const updateProfile = async (profileData) => {
    try {
      const updatedUser = await authApi.updateProfile(profileData);
      setUser(updatedUser);
      queryClient.setQueryData(['user'], updatedUser);
      toast.success('Profile updated successfully');
      return updatedUser;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
      throw error;
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    loading: loading || userLoading,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    updateProfile,
    loginLoading: loginMutation.isPending,
    registerLoading: registerMutation.isPending,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
