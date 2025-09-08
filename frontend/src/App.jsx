import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import PublicLayout from './components/layout/PublicLayout';
import PublicNavbar from './components/layout/PublicNavbar';
import ErrorBoundary from './components/ui/ErrorBoundary';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import NotFound from './pages/NotFound';

// Customer Pages
import CustomerDashboard from './pages/customer/Dashboard';
import ProductList from './pages/customer/ProductList';
import ProductView from './pages/customer/ProductView';
import LandView from './pages/customer/LandView';
import PublicLands from './pages/customer/Lands';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrderHistory from './pages/customer/OrderHistory';
import OrderDetail from './pages/customer/OrderDetail';
import CustomerProfilePage from './pages/customer/ProfilePage';
import ProfilePage from './pages/ProfilePage';

// Farmer Pages
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import FarmerProducts from './pages/farmer/Products';
import Lands from './pages/farmer/Lands';
import EditLand from './pages/farmer/EditLand';
import EditProduct from './pages/farmer/EditProduct';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminProducts from './pages/admin/Products';
import AdminLands from './pages/admin/Lands';
import AdminOrders from './pages/admin/Orders';
import AdminFarmers from './pages/admin/Farmers';
import CreateUser from './pages/admin/CreateUser';
import Analytics from './pages/admin/Analytics';
import Activity from './pages/admin/Activity';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AuthProvider>
            <CartProvider>
              <div className="min-h-screen bg-neutral-50">
                <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Profile Route - Accessible to all authenticated users */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'farmer', 'customer']}>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<ProfilePage />} />
                </Route>
                
                {/* Public Product Routes with PublicLayout */}
                <Route path="/products" element={
                  <div className="min-h-screen bg-gray-50">
                    <PublicNavbar />
                    <main>
                      <ProductList />
                    </main>
                  </div>
                } />
                <Route path="/lands" element={
                  <div className="min-h-screen bg-gray-50">
                    <PublicNavbar />
                    <main>
                      <PublicLands />
                    </main>
                  </div>
                } />
                <Route path="/products/:id" element={
                  <div className="min-h-screen bg-gray-50">
                    <PublicNavbar />
                    <main>
                      <ProductView />
                    </main>
                  </div>
                } />
                <Route path="/lands/:id" element={
                  <div className="min-h-screen bg-gray-50">
                    <PublicNavbar />
                    <main>
                      <LandView />
                    </main>
                  </div>
                } />

                {/* Cart Route - Accessible to authenticated customers only */}
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<CartPage />} />
                </Route>

                {/* Customer Routes */}
                <Route
                  path="/customer/*"
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <Layout>
                        <Routes>
                          <Route path="/" element={<CustomerDashboard />} />
                          <Route path="/lands/:id" element={<LandView />} />
                          <Route path="/checkout" element={<CheckoutPage />} />
                          <Route path="/orders" element={<OrderHistory />} />
                          <Route path="/orders/:id" element={<OrderDetail />} />
                          <Route path="/profile" element={<CustomerProfilePage />} />
                        </Routes>
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                {/* Farmer Routes */}
                <Route
                  path="/farmer/*"
                  element={
                    <ProtectedRoute allowedRoles={['farmer']}>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<FarmerDashboard />} />
                  <Route path="dashboard" element={<FarmerDashboard />} />
                  <Route path="products" element={<FarmerProducts />} />
                  <Route path="lands" element={<Lands />} />
                  <Route path="lands/:landId/edit" element={<EditLand />} />
                  <Route path="products/:productId/edit" element={<EditProduct />} />
                </Route>

                {/* Admin Routes - With Layout and Outlet */}
                <Route
                  path="/admin/*"
                  element={<Layout />}
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="users/create" element={<CreateUser />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="lands" element={<AdminLands />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="farmers" element={<AdminFarmers />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="activity" element={<Activity />} />
                </Route>

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>

              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#22c55e',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 5000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
              </div>
            </CartProvider>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
