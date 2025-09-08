import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Plus, Package, AlertCircle, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { productApi, landApi } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import AccountStatusBanner from '../../components/farmer/AccountStatusBanner';
import StatsGrid from '../../components/farmer/StatsGrid';
import ProductsTable from '../../components/farmer/ProductsTable';
import LandsTable from '../../components/farmer/LandsTable';
import CreateProductModal from '../../components/farmer/CreateProductModal';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    unit: 'kg',
    minOrderQuantity: 1,
    organic: true,
    fresh: true,
    images: [],
    land: ''
  });

  // Fetch farmer's products
  const { data: productsData, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['farmerProducts'],
    queryFn: () => productApi.getFarmerProducts(),
    enabled: !!user
  });

  // Fetch farmer's lands
  const { data: landsData, isLoading: landsLoading, error: landsError } = useQuery({
    queryKey: ['farmerLands'],
    queryFn: () => landApi.getFarmerLands(),
    enabled: !!user
  });

  const products = productsData?.products || [];
  const lands = landsData?.lands || [];

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: (productData) => productApi.createProduct(productData),
    onSuccess: () => {
      queryClient.invalidateQueries(['farmerProducts']);
      setShowCreateForm(false);
      setNewProduct({
        name: '',
        description: '',
        category: '',
        price: '',
        stock: '',
        unit: 'kg',
        minOrderQuantity: 1,
        organic: true,
        fresh: true,
        images: [],
        land: ''
      });
      toast.success('Product created successfully! It will be reviewed by admin.');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create product');
    }
  });

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      toast.error('Please select valid image files');
      return;
    }
    
    if (newProduct.images.length + imageFiles.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    
    // Convert files to base64 for preview
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewProduct(prev => ({
          ...prev,
          images: [...prev.images, {
            file: file,
            preview: e.target.result,
            name: file.name
          }]
        }));
      };
      reader.readAsDataURL(file);
    });
  };
  
  // Handle image removal
  const handleImageRemove = (index) => {
    setNewProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare product data with images as base64 strings
    const productData = {
      ...newProduct,
      images: newProduct.images.map(img => img.preview), // Send base64 strings
      thumbnail: newProduct.images.length > 0 ? newProduct.images[0].preview : null // Use first image as thumbnail
    };
    
    createProductMutation.mutate(productData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AccountStatusBanner user={user} />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.firstName}!</h1>
              <p className="text-gray-600 mt-2">Manage your farm products and track your business</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        <StatsGrid products={products} lands={lands} />

        {/* Products Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Your Products</h2>
                <p className="text-gray-600 mt-1">Manage and track your farm products</p>
              </div>
              <a
                href="/farmer/products"
                className="btn-outline flex items-center space-x-2"
              >
                <Package className="w-4 h-4" />
                <span>Manage Products</span>
              </a>
            </div>
          </div>
          
          <div className="p-6">
            {productsLoading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : productsError ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Error loading products</h3>
                <p className="text-gray-600 mb-6">{productsError.message}</p>
                <button
                  onClick={() => queryClient.invalidateQueries(['farmerProducts'])}
                  className="btn-primary"
                >
                  Try Again
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products yet</h3>
                <p className="text-gray-600 mb-6">Start by adding your first farm product</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="btn-primary"
                >
                  Add Your First Product
                </button>
              </div>
            ) : (
              <ProductsTable products={products} />
            )}
          </div>
        </div>

        {/* Lands Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mt-8">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Your Lands</h2>
                <p className="text-gray-600 mt-1">Manage your land listings and track their status</p>
              </div>
              <a
                href="/farmer/lands"
                className="btn-outline flex items-center space-x-2"
              >
                <MapPin className="w-4 h-4" />
                <span>Manage Lands</span>
              </a>
            </div>
          </div>
          
          <div className="p-6">
            {landsLoading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your lands...</p>
              </div>
            ) : lands.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No lands listed yet</h3>
                <p className="text-gray-600 mb-6">Add your land details to showcase your farming capabilities</p>
                <a
                  href="/farmer/lands"
                  className="btn-primary"
                >
                  Add Your First Land
                </a>
              </div>
            ) : (
              <LandsTable lands={lands} />
            )}
          </div>
        </div>

        <CreateProductModal
          showCreateForm={showCreateForm}
          setShowCreateForm={setShowCreateForm}
          newProduct={newProduct}
          setNewProduct={setNewProduct}
          handleSubmit={handleSubmit}
          createProductMutation={createProductMutation}
          handleImageUpload={handleImageUpload}
          handleImageRemove={handleImageRemove}
          lands={lands}
        />
      </div>
    </div>
  );
};

export default FarmerDashboard;
