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
    res.writeHead(200, corsHeaders);
    res.end(JSON.stringify({
      success: true,
      data: [
        {
          _id: '1',
          name: 'Fresh Organic Tomatoes',
          price: 50,
          category: 'vegetables',
          description: 'Fresh organic tomatoes from local farms',
          images: ['https://via.placeholder.com/300x200?text=Tomatoes'],
          stock: 100,
          unit: 'kg'
        },
        {
          _id: '2',
          name: 'Organic Carrots',
          price: 40,
          category: 'vegetables',
          description: 'Fresh organic carrots',
          images: ['https://via.placeholder.com/300x200?text=Carrots'],
          stock: 80,
          unit: 'kg'
        }
      ]
    }));
  },

  '/api/auth/login': (req, res) => {
    res.writeHead(200, corsHeaders);
    res.end(JSON.stringify({
      success: true,
      message: 'Login endpoint - use POST method',
      token: 'demo-token-123'
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
