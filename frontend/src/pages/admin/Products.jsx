import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { Eye, Edit, Trash2, CheckCircle, XCircle, Search, Filter, Clock } from 'lucide-react';

const Products = () => {
  const [filter, setFilter] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or table
  const queryClient = useQueryClient();

  const { data: productsData, isLoading, error } = useQuery({
    queryKey: ['admin-products'],
    queryFn: adminApi.getProducts,
  });

  const products = productsData?.products || [];

  const approveProductMutation = useMutation({
    mutationFn: ({ productId, adminNotes }) => adminApi.approveProduct(productId, adminNotes),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products']);
      toast.success('Product approved successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to approve product');
    },
  });

  const rejectProductMutation = useMutation({
    mutationFn: ({ productId, adminNotes }) => adminApi.rejectProduct(productId, adminNotes),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products']);
      toast.success('Product rejected successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to reject product');
    },
  });

  const setProductPendingMutation = useMutation({
    mutationFn: ({ productId, adminNotes }) => adminApi.setProductPending(productId, adminNotes),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products']);
      toast.success('Product set to pending successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to set product to pending');
    },
  });

  const handleStatusUpdate = (productId, newStatus) => {
    if (newStatus === 'approved') {
      approveProductMutation.mutate({ productId, adminNotes: 'Approved by admin' });
    } else if (newStatus === 'rejected') {
      rejectProductMutation.mutate({ productId, adminNotes: 'Rejected by admin' });
    } else if (newStatus === 'pending') {
      setProductPendingMutation.mutate({ productId, adminNotes: 'Set to pending by admin' });
    }
  };

  const handleBulkStatusUpdate = (status) => {
    selectedProducts.forEach(productId => {
      if (status === 'approved') {
        approveProductMutation.mutate({ productId, adminNotes: 'Bulk approved by admin' });
      } else if (status === 'rejected') {
        rejectProductMutation.mutate({ productId, adminNotes: 'Bulk rejected by admin' });
      } else if (status === 'pending') {
        setProductPendingMutation.mutate({ productId, adminNotes: 'Bulk set to pending by admin' });
      }
    });
    setSelectedProducts([]);
    toast.success(`Updated ${selectedProducts.length} products to ${status}`);
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(product => product._id));
    }
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-medium">Error loading products</h3>
        <p className="text-red-600 mt-2">{error.message}</p>
      </div>
    );
  }

  // Safety check for products data
  if (!products || !Array.isArray(products)) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-yellow-800 font-medium">No products data available</h3>
        <p className="text-yellow-600 mt-2">Products data is not in the expected format.</p>
      </div>
    );
  }

  const filteredProducts = Array.isArray(products) ? products.filter(product => {
    const matchesFilter = filter === 'all' || product.isApproved === (filter === 'approved');
    const matchesSearch = searchTerm === '' || 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.farmer?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.farmer?.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesFilter && matchesSearch && matchesCategory;
  }) : [];

  // Get unique categories for filter
  const categories = Array.isArray(products) ? [...new Set(products.map(product => product.category).filter(Boolean))] : [];

  const getStatusBadge = (isApproved) => {
    if (isApproved) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Approved
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        Pending
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
            <p className="text-gray-600 mt-2">Review and approve farmer products</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products by name, description, or farmer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filters and View Mode */}
          <div className="flex items-center space-x-4">
            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex space-x-2">
              {['all', 'pending', 'approved'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                    filter === status
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 text-sm font-medium rounded-l-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 text-sm font-medium rounded-r-lg transition-colors ${
                  viewMode === 'table'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Table
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-700">
                {selectedProducts.length} product(s) selected
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkStatusUpdate('approved')}
                  className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Approve All
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('rejected')}
                  className="flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Reject All
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('pending')}
                  className="flex items-center px-3 py-1 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700"
                >
                  <Clock className="w-4 h-4 mr-1" />
                  Set Pending
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Products Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {/* Product Image */}
              <div className="h-48 bg-gray-200 flex items-center justify-center relative">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product._id)}
                  onChange={() => handleSelectProduct(product._id)}
                  className="absolute top-2 left-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-4xl">🥬</span>
                )}
                <div className="absolute top-2 right-2">
                  {getStatusBadge(product.isApproved)}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
                  {product.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-green-600">
                    ₹{product.price}
                  </span>
                  <span className="text-sm text-gray-500">
                    Stock: {product.stock}
                  </span>
                </div>

                <div className="text-sm text-gray-500 mb-4">
                  <p><strong>Farmer:</strong> {product.farmer?.firstName} {product.farmer?.lastName}</p>
                  <p><strong>Category:</strong> {product.category}</p>
                  <p><strong>Added:</strong> {new Date(product.createdAt).toLocaleDateString()}</p>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewProduct(product)}
                    className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </button>
                  {!product.isApproved && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(product._id, 'approved')}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(product._id, 'rejected')}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {product.isApproved && (
                    <button
                      onClick={() => handleStatusUpdate(product._id, 'pending')}
                      className="flex-1 bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors"
                    >
                      Set Pending
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Farmer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => handleSelectProduct(product._id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-400">🥬</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.farmer?.firstName} {product.farmer?.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(product.isApproved)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewProduct(product)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-lg hover:bg-blue-100"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {!product.isApproved && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(product._id, 'approved')}
                              className="text-green-600 hover:text-green-900 bg-green-50 p-2 rounded-lg hover:bg-green-100"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(product._id, 'rejected')}
                              className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg hover:bg-red-100"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {product.isApproved && (
                          <button
                            onClick={() => handleStatusUpdate(product._id, 'pending')}
                            className="text-yellow-600 hover:text-yellow-900 bg-yellow-50 p-2 rounded-lg hover:bg-yellow-100"
                            title="Set to Pending"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">🥬</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">No products match the current filter criteria.</p>
        </div>
      )}

      {/* Product Details Modal */}
      {showProductModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Product Details</h3>
                <button
                  onClick={() => setShowProductModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Product Images */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedProduct.images && selectedProduct.images.length > 0 ? (
                      selectedProduct.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${selectedProduct.name} ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ))
                    ) : (
                      <div className="col-span-2 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-2xl">🥬</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                    <p className="text-gray-900 text-lg font-semibold">{selectedProduct.name}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <p className="text-gray-900">{selectedProduct.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                      <p className="text-2xl font-bold text-green-600">${selectedProduct.price}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                      <p className="text-gray-900">{selectedProduct.stock} units</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <p className="text-gray-900">{selectedProduct.category}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Farmer</label>
                    <p className="text-gray-900">{selectedProduct.farmer?.firstName} {selectedProduct.farmer?.lastName}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    {getStatusBadge(selectedProduct.isApproved)}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Added Date</label>
                    <p className="text-gray-900">{new Date(selectedProduct.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-4 pt-6 border-t border-gray-200 mt-6">
                {!selectedProduct.isApproved && (
                  <>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedProduct._id, 'approved');
                        setShowProductModal(false);
                      }}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Product
                    </button>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedProduct._id, 'rejected');
                        setShowProductModal(false);
                      }}
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Product
                    </button>
                  </>
                )}
                {selectedProduct.isApproved && (
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedProduct._id, 'pending');
                      setShowProductModal(false);
                    }}
                    className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Set to Pending
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;