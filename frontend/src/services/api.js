import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors and network issues
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        type: 'network'
      });
    }

    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject({
        message: 'Session expired. Please login again.',
        type: 'auth'
      });
    }

    // Handle server errors
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data);
      return Promise.reject({
        message: 'Server error. Please try again later.',
        type: 'server'
      });
    }

    // Handle other errors
    return Promise.reject({
      message: error.response?.data?.message || 'An error occurred',
      type: 'client',
      status: error.response?.status
    });
  }
);

// API endpoints
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

export const productApi = {
  getProducts: (params = {}) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  addReview: (productId, reviewData) => api.post(`/products/${productId}/reviews`, reviewData),
  // Farmer specific endpoints
  getFarmerProducts: (params = {}) => api.get('/products/farmer', { params }),
  getFarmerProduct: (id) => api.get(`/products/${id}`),
  updateFarmerProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteFarmerProduct: (id) => api.delete(`/farmer/products/${id}`),
};

export const landApi = {
  // Public endpoints
  getLands: (params = {}) => api.get('/lands', { params }),
  getLand: (id) => api.get(`/lands/${id}`),
  // Farmer endpoints
  getFarmerLands: (params = {}) => api.get('/lands/farmer', { params }),
  createLand: (data) => api.post('/lands', data),
  updateLand: (id, data) => api.put(`/lands/${id}`, data),
  deleteLand: (id) => api.delete(`/lands/${id}`),
};

export const orderApi = {
  createOrder: (data) => api.post('/orders', data),
  getMyOrders: (params = {}) => api.get('/orders', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  // Farmer specific endpoints
  getFarmerOrders: (params = {}) => api.get('/orders/farmer', { params }),
  updateFarmerOrderStatus: (id, status) => api.put(`/orders/farmer/${id}/status`, { status }),
};

export const cartApi = {
  getCart: () => api.get('/cart'),
  addToCart: (productId, quantity) => api.post('/cart/items', { productId, quantity }),
  updateCartItem: (productId, quantity) => api.put(`/cart/items/${productId}`, { quantity }),
  removeFromCart: (productId) => api.delete(`/cart/items/${productId}`),
  clearCart: () => api.delete('/cart'),
};

export const userApi = {
  updateProfile: (data) => api.put('/users/profile', data),
  getProfile: () => api.get('/users/profile'),
  updatePassword: (data) => api.put('/users/password', data),
  updateAddresses: (data) => api.put('/users/addresses', data),
};

export const farmerApi = {
  // Dashboard
  getDashboard: () => api.get('/farmers/dashboard'),
  
  // Products
  getProducts: () => api.get('/farmers/products'),
  createProduct: (data) => api.post('/products', data),
  
  // Orders
  getOrders: () => api.get('/farmers/orders'),
  
  // Profile
  updateProfile: (data) => api.put('/farmers/profile', data),
};

export const adminApi = {
  // Dashboard and analytics
  getDashboardStats: () => api.get('/admin/dashboard'),
  getAnalytics: (params = {}) => api.get('/admin/analytics', { params }),
  getActivityLog: (params = {}) => api.get('/admin/activity', { params }),
  
  // User management
  getUsers: (params = {}) => api.get('/users', { params }),
  createUser: (data) => api.post('/users', data),
  updateUserStatus: (userId, status) => api.put(`/users/${userId}/status`, { status }),
  deleteUser: (userId) => api.delete(`/users/${userId}`),
  
  // Farmer management
  getFarmers: (params = {}) => api.get('/admin/farmers', { params }),
  verifyFarmer: (farmerId) => api.put(`/admin/farmers/${farmerId}/verify`),
  rejectFarmer: (farmerId) => api.put(`/admin/farmers/${farmerId}/reject`),
  
  // Product management
  getProducts: (params = {}) => api.get('/admin/products', { params }),
  approveProduct: (productId, adminNotes) => api.put(`/admin/products/${productId}/approve`, { adminNotes }),
  rejectProduct: (productId, adminNotes) => api.put(`/admin/products/${productId}/reject`, { adminNotes }),
  setProductPending: (productId, adminNotes) => api.put(`/admin/products/${productId}/pending`, { adminNotes }),
  
  // Land management
  getLands: (params = {}) => api.get('/admin/lands', { params }),
  approveLand: (landId, adminNotes) => api.put(`/admin/lands/${landId}/approve`, { adminNotes }),
  rejectLand: (landId, adminNotes) => api.put(`/admin/lands/${landId}/reject`, { adminNotes }),
  setLandPending: (landId, adminNotes) => api.put(`/admin/lands/${landId}/pending`, { adminNotes }),
  
  // Order management
  getOrders: (params = {}) => api.get('/admin/orders', { params }),
  updateOrderStatus: (orderId, status) => api.put(`/admin/orders/${orderId}/status`, { status }),
};

export default api;
