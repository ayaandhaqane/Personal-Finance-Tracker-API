# Personal Finance Tracker API

A comprehensive Personal Finance Tracker API built with Node.js, Express, MongoDB, and JWT authentication. This API allows users to track their income and expenses, organize transactions into categories, upload profile pictures, and view monthly summaries.

## 🚀 Features

- **User Authentication**: JWT-based authentication with registration, login, and profile management
- **Transaction Management**: Full CRUD operations for income and expense tracking
- **Category Management**: Predefined categories for better organization
- **File Upload**: Profile picture uploads using Cloudinary
- **Monthly Summaries**: Detailed monthly financial summaries by category
- **Admin Dashboard**: Admin-only analytics and overview
- **Security**: Rate limiting, CORS, Helmet, and input validation
- **Documentation**: Comprehensive Swagger API documentation

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account (for file uploads)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd personal-finance-tracker-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

Once the server is running, visit:
- **Swagger Documentation**: `http://localhost:5000/docs`
- **Health Check**: `http://localhost:5000/health`

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)

### Transactions
- `GET /api/transactions` - Get all transactions (Protected)
- `GET /api/transactions/:id` - Get single transaction (Protected)
- `POST /api/transactions` - Create new transaction (Protected)
- `PUT /api/transactions/:id` - Update transaction (Protected)
- `DELETE /api/transactions/:id` - Delete transaction (Protected)
- `GET /api/transactions/monthly-summary` - Get monthly summary (Protected)

### Categories
- `GET /api/categories` - Get predefined categories

### File Upload
- `POST /api/upload/profile-picture` - Upload profile picture (Protected)

### Admin
- `GET /api/admin/overview` - Get admin overview (Admin only)

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📊 Transaction Schema

```json
{
  "title": "Groceries",
  "amount": -50,
  "type": "expense",
  "category": "Food",
  "description": "Weekly grocery shopping",
  "date": "2025-01-27T10:00:00Z"
}
```

## 🚀 Deployment

### Deploy to Render

1. **Create a new Web Service on Render**
2. **Connect your GitHub repository**
3. **Configure environment variables** in Render dashboard:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A secure random string
   - `JWT_EXPIRE` - Token expiration (e.g., "7d")
   - `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY` - Your Cloudinary API key
   - `CLOUDINARY_API_SECRET` - Your Cloudinary API secret
   - `NODE_ENV` - Set to "production"

4. **Deploy**

The API will be available at your Render URL (e.g., `https://your-app.onrender.com`)

## 🧪 Testing

You can test the API using:
- **Swagger UI**: Interactive testing at `/docs`
- **Postman**: Import the API collection
- **cURL**: Command-line testing

### Example: Register a new user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

## 📁 Project Structure

```
src/
├── config/
│   ├── database.js      # MongoDB connection
│   ├── cloudinary.js    # Cloudinary configuration
│   └── swagger.js       # Swagger documentation config
├── controllers/
│   ├── authController.js
│   ├── transactionController.js
│   ├── categoryController.js
│   ├── uploadController.js
│   └── adminController.js
├── middleware/
│   ├── auth.js          # JWT authentication
│   ├── validation.js    # Zod validation
│   ├── upload.js        # Multer configuration
│   └── errorHandler.js  # Error handling
├── models/
│   ├── User.js          # User model
│   └── Transaction.js   # Transaction model
├── routes/
│   ├── authRoutes.js
│   ├── transactionRoutes.js
│   ├── categoryRoutes.js
│   ├── uploadRoutes.js
│   └── adminRoutes.js
├── utils/
│   └── generateToken.js  # JWT token generation
├── validators/
│   └── schemas.js       # Zod validation schemas
└── server.js            # Main server file
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Rate Limiting**: Prevents abuse and DDoS attacks
- **CORS**: Cross-origin resource sharing protection
- **Helmet**: Security headers
- **Input Validation**: Zod schema validation
- **Error Handling**: Comprehensive error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues or have questions, please:
1. Check the API documentation at `/docs`
2. Review the error messages
3. Check your environment variables
4. Ensure MongoDB is running and accessible

---

**Happy coding! 🎉**

