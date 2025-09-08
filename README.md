# 🌱 Nature's Basket

Organic vegetable marketplace connecting farmers with customers.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB

### Installation

1. **Clone and install**
   ```bash
   git clone <repository-url>
   cd natures-basket
   
   # Backend
   cd backend && npm install
   
   # Frontend  
   cd ../frontend && npm install
   ```

2. **Environment Setup**
   
   Create `backend/.env`:
   ```env
   MONGO_URI=mongodb://localhost:27017/natures-basket
   JWT_SECRET=your-secret-key
   PORT=5100
   FRONTEND_URL=http://localhost:5173
   ```

   Create `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5100
   ```

3. **Start application**
   ```bash
   # Backend
   cd backend && npm run dev
   
   # Frontend
   cd frontend && npm run dev
   ```

4. **Access**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5100

## 📱 Default Accounts

After running `npm run seed` in backend:

- **Admin**: admin@naturesbasket.com / admin123
- **Farmer**: farmer@example.com / farmer123  
- **Customer**: customer@example.com / customer123

## 🚀 Deployment

### Frontend (Netlify)
1. Connect GitHub repo to Netlify
2. Build command: `cd frontend && npm run build`
3. Publish directory: `frontend/dist`
4. Add env var: `VITE_API_URL=https://your-backend-url.com`

### Backend (Render)
1. Create Web Service on Render
2. Build command: `cd backend && npm install`
3. Start command: `cd backend && npm start`
4. Add env vars:
   - `MONGO_URI`: MongoDB connection string
   - `JWT_SECRET`: Your secret key
   - `FRONTEND_URL`: Your Netlify URL

## 🛠️ Tech Stack

**Frontend**: React, Vite, Tailwind CSS, React Query, React Router
**Backend**: Node.js, Express, MongoDB, Mongoose, JWT

## 📊 Features

- **Multi-role system**: Customer, Farmer, Admin
- **E-commerce**: Product catalog, cart, checkout, orders
- **Farmer tools**: Product management, land management, analytics
- **Admin panel**: User management, product approval, analytics

## 🔧 Scripts

**Backend**: `npm run dev`, `npm start`, `npm run seed`
**Frontend**: `npm run dev`, `npm run build`, `npm run preview`