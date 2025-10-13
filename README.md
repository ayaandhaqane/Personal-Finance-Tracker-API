# 💰 Personal Finance Tracker

A comprehensive full-stack web application for managing personal finances, built with React, Node.js, Express, and MongoDB. Track income, expenses, analyze spending patterns, and get personalized financial insights.

![Personal Finance Tracker](https://img.shields.io/badge/React-19.1.1-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.14-blue)

## ✨ Features

### 🔐 Authentication & Security
- User registration and login with JWT authentication
- Secure password hashing with bcrypt
- Protected routes and API endpoints
- Rate limiting and security middleware

### 📊 Financial Management
- **Transaction Management**: Add, edit, delete income and expense transactions
- **Category Management**: Organize transactions with custom categories
- **Real-time Analytics**: Dynamic reports with actual data from your transactions
- **Financial Health Score**: AI-powered assessment of your financial habits

### 📈 Advanced Analytics & Reports
- **Monthly Breakdown**: Visual charts showing income vs expenses over time
- **Category Analysis**: Pie charts and breakdowns by spending categories
- **Trend Analysis**: Growth rates, savings rates, and spending patterns
- **Personalized Recommendations**: AI-driven financial advice based on your data

### 🎨 Modern UI/UX
- Responsive design with TailwindCSS
- Interactive charts and visualizations
- Dark/light theme support
- Mobile-first approach

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (free tier available)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd capstoneProject
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the `backend` directory:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   PORT=5000
   NODE_ENV=development
   ```

4. **Start the application**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start individually:
   # Backend only
   npm run server
   
   # Frontend only
   npm run client
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/docs

## 🔑 Demo Credentials

For testing purposes, you can use these demo credentials:
- **Email**: `demo@example.com`
- **Password**: `demo123`

Or create your own account by clicking "create a new account" on the login page.

## 🏗️ Project Structure

```
capstoneProject/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── config/         # Database and cloudinary config
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Helper functions
│   │   └── validators/     # Input validation schemas
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   └── assets/         # Static assets
│   └── package.json
└── package.json           # Root package.json
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/stats` - Get transaction statistics

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Analytics
- `GET /api/analytics` - Get comprehensive analytics
- `GET /api/analytics/monthly-summary` - Get monthly summary
- `GET /api/analytics/categories` - Get category analytics

## 🛠️ Technologies Used

### Frontend
- **React 19.1.1** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS 4.1.14** - Styling framework
- **React Router DOM** - Client-side routing
- **Heroicons** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js 5.1.0** - Web framework
- **MongoDB** - Database
- **Mongoose 8.18.2** - MongoDB object modeling
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Swagger** - API documentation

### Development Tools
- **Nodemon** - Auto-restart server
- **ESLint** - Code linting
- **Concurrently** - Run multiple commands

## 🎯 Key Features Explained

### Dynamic Reports System
The reports page generates real-time analytics based on your actual transaction data:
- **Financial Health Score**: Calculated based on savings rate, expense control, and income growth
- **Personalized Recommendations**: AI-driven suggestions based on spending patterns
- **Interactive Charts**: Monthly breakdowns and category analysis
- **Trend Analysis**: Growth rates and spending patterns over time

### Security Features
- JWT-based authentication with secure token handling
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- Input validation and sanitization
- CORS protection
- Helmet.js for security headers

## 🔧 Development

### Available Scripts

```bash
# Root level
npm run dev          # Start both frontend and backend
npm run server       # Start backend only
npm run client       # Start frontend only
npm run build        # Build for production

# Backend only
cd backend
npm run dev          # Start with nodemon
npm start           # Start with node

# Frontend only
cd frontend
npm run dev         # Start dev server
npm run build       # Build for production
npm run preview     # Preview production build
```

### Database Schema

#### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

#### Transaction Model
```javascript
{
  user: ObjectId (ref: User),
  type: String (income/expense),
  amount: Number,
  category: String,
  description: String,
  date: Date,
  createdAt: Date
}
```

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
1. Set environment variables in your hosting platform
2. Ensure MongoDB Atlas allows connections from hosting IP
3. Deploy the backend folder

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Update API base URL in `frontend/src/services/api.js`
3. Deploy the built files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure your IP is whitelisted in MongoDB Atlas
   - Check your connection string in the `.env` file
   - Verify your MongoDB Atlas cluster is running

2. **Port Already in Use**
   - Kill processes using port 5000: `npx kill-port 5000`
   - Or change the PORT in your `.env` file

3. **Module Not Found Errors**
   - Run `npm install` in both root and backend directories
   - Clear node_modules and reinstall if needed

## 📞 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Review the API documentation at `/docs`
3. Open an issue in the repository

---

**Built with ❤️ for better financial management**