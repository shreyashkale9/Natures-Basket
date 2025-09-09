// Netlify Functions API handler
exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  const { path } = event;
  const { httpMethod, queryStringParameters, body } = event;

  // Sample data
  const sampleProducts = [
    {
      _id: '1',
      name: 'Fresh Organic Tomatoes',
      price: 50,
      category: 'vegetables',
      description: 'Fresh organic tomatoes from local farms',
      images: ['https://via.placeholder.com/300x200?text=Tomatoes'],
      stock: 100,
      unit: 'kg',
      organic: true,
      rating: 4.5,
      reviews: 25
    },
    {
      _id: '2',
      name: 'Organic Carrots',
      price: 40,
      category: 'vegetables',
      description: 'Fresh organic carrots',
      images: ['https://via.placeholder.com/300x200?text=Carrots'],
      stock: 80,
      unit: 'kg',
      organic: true,
      rating: 4.2,
      reviews: 18
    },
    {
      _id: '3',
      name: 'Green Bell Peppers',
      price: 60,
      category: 'vegetables',
      description: 'Fresh green bell peppers',
      images: ['https://via.placeholder.com/300x200?text=Peppers'],
      stock: 50,
      unit: 'kg',
      organic: false,
      rating: 4.0,
      reviews: 12
    },
    {
      _id: '4',
      name: 'Organic Spinach',
      price: 30,
      category: 'leafy-greens',
      description: 'Fresh organic spinach leaves',
      images: ['https://via.placeholder.com/300x200?text=Spinach'],
      stock: 75,
      unit: 'bunch',
      organic: true,
      rating: 4.7,
      reviews: 32
    }
  ];

  // Helper function to filter and sort products
  function filterAndSortProducts(products, query) {
    let filtered = [...products];
    
    // Search filter
    if (query && query.search) {
      const searchTerm = query.search.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );
    }
    
    // Price filter
    if (query && query.minPrice) {
      filtered = filtered.filter(product => product.price >= parseInt(query.minPrice));
    }
    if (query && query.maxPrice) {
      filtered = filtered.filter(product => product.price <= parseInt(query.maxPrice));
    }
    
    // Category filter
    if (query && query.category) {
      filtered = filtered.filter(product => product.category === query.category);
    }
    
    // Sort
    if (query && query.sortBy) {
      filtered.sort((a, b) => {
        const aVal = a[query.sortBy];
        const bVal = b[query.sortBy];
        
        if (query.sortOrder === 'desc') {
          return bVal > aVal ? 1 : -1;
        } else {
          return aVal > bVal ? 1 : -1;
        }
      });
    }
    
    return filtered;
  }

  try {
    // Route handling
    if (path === '/api/health') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'healthy',
          message: 'Nature\'s Basket API is running!',
          timestamp: new Date().toISOString()
        }),
      };
    }

    if (path === '/api/products') {
      const filteredProducts = filterAndSortProducts(sampleProducts, queryStringParameters);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: filteredProducts,
          total: filteredProducts.length
        }),
      };
    }

    if (path === '/api/auth/login') {
      if (httpMethod === 'POST') {
        const credentials = JSON.parse(body || '{}');
        
        if (credentials.email && credentials.password) {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              message: 'Login successful',
              token: 'demo-token-123',
              user: {
                _id: '1',
                name: 'Demo User',
                email: credentials.email,
                role: 'customer'
              }
            }),
          };
        } else {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              success: false,
              message: 'Invalid credentials'
            }),
          };
        }
      } else {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: 'Login endpoint - use POST method',
            token: 'demo-token-123'
          }),
        };
      }
    }

    if (path === '/api/auth/register') {
      if (httpMethod === 'POST') {
        const userData = JSON.parse(body || '{}');
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({
            success: true,
            message: 'Registration successful',
            token: 'demo-token-123',
            user: {
              _id: '2',
              name: userData.name,
              email: userData.email,
              role: userData.role || 'customer'
            }
          }),
        };
      } else {
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Method not allowed'
          }),
        };
      }
    }

    if (path === '/api/categories') {
      const categories = [
        { _id: '1', name: 'Vegetables', slug: 'vegetables' },
        { _id: '2', name: 'Leafy Greens', slug: 'leafy-greens' },
        { _id: '3', name: 'Fruits', slug: 'fruits' },
        { _id: '4', name: 'Herbs', slug: 'herbs' }
      ];
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: categories
        }),
      };
    }

    // Default 404 response
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Route not found',
        path: path
      }),
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Internal server error',
        error: error.message
      }),
    };
  }
};
