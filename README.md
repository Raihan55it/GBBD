# BD eBazar - Bangladeshi E-commerce Platform

A modern, full-featured e-commerce platform specifically designed for selling premium Bangladeshi food products. Built with Node.js, Express, MongoDB, and vanilla JavaScript.

## 🚀 Features

### For Customers
- **Product Catalog**: Browse products by category with detailed descriptions
- **Advanced Search**: Search products by name, category, or filters
- **Shopping Cart**: Full cart functionality with quantity management
- **User Accounts**: Registration, login, and profile management
- **Order Management**: Place orders, track status, view order history
- **Product Reviews**: Rate and review purchased products
- **Wishlist**: Save favorite products for later
- **Responsive Design**: Works perfectly on all devices

### For Administrators
- **Admin Dashboard**: Comprehensive dashboard with statistics
- **Product Management**: Add, edit, delete products with inventory tracking
- **Order Management**: View, update order status, manage shipping
- **User Management**: View and manage customer accounts
- **Analytics**: Sales reports and business insights

### Technical Features
- **RESTful API**: Well-documented API endpoints
- **Authentication**: Secure JWT-based authentication
- **Database**: MongoDB with comprehensive schemas
- **Validation**: Input validation and sanitization
- **Security**: Rate limiting, CORS, helmet security
- **SEO Optimized**: Meta tags and semantic HTML
- **Performance**: Optimized images and caching

## 📋 Requirements

- Node.js 16.0 or higher
- MongoDB 4.4 or higher
- npm or yarn

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd GBBD
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bd-ebazar
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
FRONTEND_URL=http://localhost:3000
```

### 4. Database Setup
Make sure MongoDB is running on your system or update the `MONGODB_URI` to point to your MongoDB instance.

### 5. Seed Database
```bash
node seed.js
```
This will create initial products and an admin account:
- Email: `admin@bdebazar.com`
- Password: `admin123456`

### 6. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
GBBD/
├── models/                 # Database models
│   ├── User.js            # User schema and methods
│   ├── Product.js         # Product schema and methods
│   └── Order.js           # Order schema and methods
├── routes/                # API routes
│   ├── auth.js            # Authentication routes
│   ├── products.js        # Product routes
│   ├── orders.js          # Order routes
│   ├── users.js           # User routes
│   └── admin.js           # Admin routes
├── middleware/             # Custom middleware
│   └── auth.js            # Authentication middleware
├── public/                # Static files
├── uploads/               # File uploads directory
├── imageForGBBD/         # Product images
├── index.html             # Main HTML file
├── style.css              # Stylesheets
├── script.js              # Frontend JavaScript
├── server.js              # Express server
├── package.json           # Dependencies and scripts
├── .env.example           # Environment variables template
├── seed.js                # Database seeding script
└── README.md              # This file
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/addresses` - Add shipping address
- `POST /api/auth/wishlist/:productId` - Toggle wishlist item

### Products
- `GET /api/products` - Get all products (with pagination, filtering)
- `GET /api/products/:id` - Get single product
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/search/:query` - Search products
- `GET /api/products/featured/all` - Get featured products
- `POST /api/products/:id/reviews` - Add product review

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/cancel` - Cancel order
- `PUT /api/orders/:id/payment-confirm` - Confirm payment

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/products` - Get all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/status` - Update user status

## 🎨 Frontend Features

### Product Display
- Product cards with images, prices, ratings
- Discount badges and sale indicators
- Stock status indicators
- Category filtering
- Search functionality
- Pagination

### Shopping Experience
- Add to cart functionality
- Cart management modal
- Checkout process
- Multiple payment methods
- Order tracking
- User authentication

### User Interface
- Responsive design
- Mobile-optimized
- Smooth animations
- Interactive modals
- Loading states
- Error handling

## 🔒 Security Features

- JWT authentication with expiration
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Helmet security headers
- SQL injection prevention (NoSQL injection)
- XSS protection

## 📊 Admin Features

### Dashboard
- Total orders and revenue
- User statistics
- Product inventory
- Order status breakdown
- Category analysis

### Management
- Product CRUD operations
- Order status management
- User account management
- Inventory tracking
- Sales analytics

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
1. Set environment variables
2. Build assets if needed
3. Start the server:
```bash
npm start
```

### Environment Variables for Production
- `NODE_ENV=production`
- `MONGODB_URI` - Production MongoDB connection
- `JWT_SECRET` - Strong secret key
- `EMAIL_USER/PASS` - Email service credentials
- `STRIPE_KEYS` - Payment processor keys

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, please contact:
- Email: info@bdebazar.com
- Phone: 01712-345678

## 🔄 Updates

Future enhancements planned:
- Payment gateway integration (Stripe, bKash, Nagad)
- Advanced analytics dashboard
- Mobile app development
- Multi-language support
- Advanced inventory management
- Customer support system
- Social media integration

---

Built with ❤️ in Bangladesh for Bangladeshi businesses