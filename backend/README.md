# Nature's Basket Backend API

A comprehensive backend API for Nature's Basket - an organic vegetable marketplace that connects farmers directly with customers.

## 🚀 Features

- **Multi-User System**: Support for Customers, Farmers, and Admins
- **Product Management**: Farmers can create, update, and manage their products
- **Order Management**: Complete order lifecycle from creation to delivery
- **Shopping Cart**: Full cart functionality for customers
- **Admin Dashboard**: Comprehensive admin panel for platform management
- **JWT Authentication**: Secure authentication with role-based access control
- **MongoDB Integration**: Robust data storage with Mongoose ODM

## 🏗️ Architecture

### User Types

1. **Customer (Buyer)**
   - Browse and purchase products
   - Manage shopping cart
   - View order history
   - Add product reviews

2. **Farmer (Seller)**
   - Create and manage products
   - View orders for their products
   - Track earnings and sales
   - Manage farm profile

3. **Admin**
   - Approve/reject farmer products
   - Manage all users and orders
   - View platform statistics
   - Verify farmers

### Database Models

- **User**: Multi-role user system with role-specific fields
- **Product**: Comprehensive product information with farmer details
- **Order**: Complete order management with status tracking
- **Cart**: Shopping cart functionality
- **Category**: Product categorization

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/natures-basket
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5000
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB (if running locally)
   mongod
   
   # Seed initial data
   npm run seed
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (customer/farmer)
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user profile

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured` - Get featured products
- `GET /api/products/farmer/:farmerId` - Get farmer's products
- `POST /api/products` - Create product (farmer only)
- `PUT /api/products/:id` - Update product (farmer only)
- `DELETE /api/products/:id` - Delete product (farmer only)
- `POST /api/products/:id/reviews` - Add product review (customer only)

### Orders
- `POST /api/orders` - Create order (customer only)
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (farmer/admin)
- `PUT /api/orders/:id/cancel` - Cancel order (customer only)

### Cart
- `GET /api/cart` - Get user's cart
- `GET /api/cart/count` - Get cart item count
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:itemId` - Update cart item quantity
- `DELETE /api/cart/remove/:itemId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/status` - Update user status
- `GET /api/admin/products` - Get all products (admin view)
- `PUT /api/admin/products/:id/approval` - Approve/reject product
- `GET /api/admin/orders` - Get all orders (admin view)
- `GET /api/admin/farmers/stats` - Get farmer statistics
- `PUT /api/admin/farmers/:id/verify` - Verify/unverify farmer

## 🔐 Authentication & Authorization

### JWT Token
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Role-Based Access
- **Customer**: Can access cart, orders, and product browsing
- **Farmer**: Can manage their products and view their orders
- **Admin**: Full access to all platform management features

## 📊 Database Schema

### User Model
```javascript
{
  uniqueId: String,
  name: String,
  email: String,
  password: String,
  addresses: [AddressSchema],
  phone: String,
  role: ['customer', 'farmer', 'admin'],
  customerFields: {
    wishlist: [Product],
    orderHistory: [Order],
    defaultAddress: Number
  },
  farmerFields: {
    farmName: String,
    farmLocation: String,
    farmDescription: String,
    products: [Product],
    isVerified: Boolean,
    bankDetails: Object,
    totalEarnings: Number,
    totalOrders: Number
  },
  adminFields: {
    permissions: [String],
    lastLogin: Date,
    isSuperAdmin: Boolean
  }
}
```

### Product Model
```javascript
{
  name: String,
  description: String,
  price: Number,
  quantity: Number,
  unit: String,
  category: String,
  farmer: User,
  isOrganic: Boolean,
  isApproved: Boolean,
  platformFee: Number,
  farmerPrice: Number,
  reviews: [ReviewSchema],
  // ... additional fields
}
```

## 🚀 Getting Started

### Default Admin Account
After running the seed script, you'll have a default admin account:
- **Email**: admin@naturesbasket.com
- **Password**: admin123

### Testing the API
You can test the API using tools like Postman or curl:

```bash
# Test the API health
curl http://localhost:5000/

# Register a new customer
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+1234567890",
    "role": "customer"
  }'
```

## 🔧 Development

### Project Structure
```
backend/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── orderController.js
│   ├── cartController.js
│   ├── adminController.js
│   └── userController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   ├── Cart.js
│   └── Category.js
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   ├── cartRoutes.js
│   ├── adminRoutes.js
│   └── userRoutes.js
├── utils/
│   └── seedData.js
├── app.js
├── server.js
└── package.json
```

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with initial data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.
