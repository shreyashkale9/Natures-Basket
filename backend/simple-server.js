/**
 * Simple server using minimal dependencies
 * This is a fallback server to avoid Express dependency issues
 */

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// Simple CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

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
  if (query.search) {
    const searchTerm = query.search.toLowerCase();
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    );
  }
  
  // Price filter
  if (query.minPrice) {
    filtered = filtered.filter(product => product.price >= parseInt(query.minPrice));
  }
  if (query.maxPrice) {
    filtered = filtered.filter(product => product.price <= parseInt(query.maxPrice));
  }
  
  // Category filter
  if (query.category) {
    filtered = filtered.filter(product => product.category === query.category);
  }
  
  // Sort
  if (query.sortBy) {
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

// Simple routing
const routes = {
  '/api/health': (req, res) => {
    res.writeHead(200, corsHeaders);
    res.end(JSON.stringify({ 
      status: 'healthy', 
      message: 'Nature\'s Basket API is running!',
      timestamp: new Date().toISOString()
    }));
  },
  
  '/api/products': (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const query = parsedUrl.query;
    
    const filteredProducts = filterAndSortProducts(sampleProducts, query);
    
    res.writeHead(200, corsHeaders);
    res.end(JSON.stringify({
      success: true,
      data: filteredProducts,
      total: filteredProducts.length
    }));
  },

  '/api/auth/login': (req, res) => {
    if (req.method === 'POST') {
      // Handle POST login
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const credentials = JSON.parse(body);
          // Simple demo authentication
          if (credentials.email && credentials.password) {
            res.writeHead(200, corsHeaders);
            res.end(JSON.stringify({
              success: true,
              message: 'Login successful',
              token: 'demo-token-123',
              user: {
                _id: '1',
                name: 'Demo User',
                email: credentials.email,
                role: 'customer'
              }
            }));
          } else {
            res.writeHead(400, corsHeaders);
            res.end(JSON.stringify({
              success: false,
              message: 'Invalid credentials'
            }));
          }
        } catch (error) {
          res.writeHead(400, corsHeaders);
          res.end(JSON.stringify({
            success: false,
            message: 'Invalid JSON'
          }));
        }
      });
    } else {
      // Handle GET request
      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify({
        success: true,
        message: 'Login endpoint - use POST method',
        token: 'demo-token-123'
      }));
    }
  },

  '/api/auth/register': (req, res) => {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const userData = JSON.parse(body);
          res.writeHead(201, corsHeaders);
          res.end(JSON.stringify({
            success: true,
            message: 'Registration successful',
            token: 'demo-token-123',
            user: {
              _id: '2',
              name: userData.name,
              email: userData.email,
              role: userData.role || 'customer'
            }
          }));
        } catch (error) {
          res.writeHead(400, corsHeaders);
          res.end(JSON.stringify({
            success: false,
            message: 'Invalid JSON'
          }));
        }
      });
    } else {
      res.writeHead(405, corsHeaders);
      res.end(JSON.stringify({
        success: false,
        message: 'Method not allowed'
      }));
    }
  },

  '/api/categories': (req, res) => {
    const categories = [
      { _id: '1', name: 'Vegetables', slug: 'vegetables' },
      { _id: '2', name: 'Leafy Greens', slug: 'leafy-greens' },
      { _id: '3', name: 'Fruits', slug: 'fruits' },
      { _id: '4', name: 'Herbs', slug: 'herbs' }
    ];
    
    res.writeHead(200, corsHeaders);
    res.end(JSON.stringify({
      success: true,
      data: categories
    }));
  }
};

// Create server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    res.end();
    return;
  }

  // Route handling
  if (routes[pathname]) {
    routes[pathname](req, res);
  } else {
    res.writeHead(404, corsHeaders);
    res.end(JSON.stringify({ 
      success: false, 
      message: 'Route not found',
      path: pathname 
    }));
  }
});

// Start server
const PORT = process.env.PORT || 5100;
server.listen(PORT, () => {
  console.log(`🚀 Simple Nature's Basket API running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🛍️  Products: http://localhost:${PORT}/api/products`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
