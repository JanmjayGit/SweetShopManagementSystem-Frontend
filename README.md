# 🍬 Sweet Shop - Premium Handcrafted Sweets

A modern, full-stack e-commerce application for a sweet shop with React frontend, comprehensive admin panel, and Razorpay payment integration.

## ✨ Features

### 🛍️ Customer Features
- **Beautiful Landing Page** with sample products for non-authenticated users
- **User Authentication** (Register/Login) with JWT tokens
- **Advanced Search & Filtering** by category, price range, stock status
- **Smart Shopping Cart** with quantity management
- **Razorpay Payment Integration** for secure payments
- **Order History & Tracking** with detailed status updates
- **Quick View Modal** for product details
- **Wishlist/Favorites** functionality
- **Responsive Design** for all devices
- **Real-time Notifications** for user actions

### 👨‍💼 Admin Features
- **Admin Dashboard** with comprehensive statistics
- **Product Management** (Add, Edit, Delete sweets)
- **Image Upload** for product photos
- **Inventory Management** with restock functionality
- **Stock Monitoring** with low stock alerts
- **User Role Management** (Admin/Customer)

### 🎨 UI/UX Features
- **Modern Design** with gradient themes and animations
- **Loading States** with custom spinners
- **Error Handling** with user-friendly error boundaries
- **Smooth Animations** and hover effects
- **Custom Scrollbars** and focus styles
- **Glass Morphism** effects
- **Notification System** with different types

## 🚀 Tech Stack

### Frontend
- **React 18** with Hooks and Context API
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Hot Toast** for notifications
- **Axios** with interceptors for API calls
- **Vite** for build tooling

### Payment Integration
- **Razorpay** for payment processing
- **Test Credentials**: `rzp_test_Rd500r9Qey3onm`

### Backend Integration
- RESTful API endpoints
- JWT authentication
- File upload support
- Role-based access control

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:8080`

### 1. Clone the Repository
```bash
git clone <repository-url>
cd sweet-shop-frontend
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Start Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## 🔧 API Configuration

The application expects the following API endpoints:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Sweets Management
- `GET /api/sweets` - Get all sweets (requires auth)
- `POST /api/sweets` - Add new sweet (admin only)
- `PUT /api/sweets/:id` - Update sweet (admin only)
- `DELETE /api/sweets/:id` - Delete sweet (admin only)
- `POST /api/sweets/:id/upload-image` - Upload sweet image (admin only)

### Inventory
- `POST /api/sweets/:id/purchase` - Purchase sweet
- `POST /api/sweets/:id/restock` - Restock sweet (admin only)

### Search
- `GET /api/sweets/search` - Search sweets

## 🎯 Usage Guide

### For Customers
1. **Browse Products**: Visit landing page to see sample products
2. **Register/Login**: Create account or login for full access
3. **Shop**: Use search and filters to find products
4. **Add to Cart**: Manage quantities in shopping cart
5. **Checkout**: Complete purchase with Razorpay
6. **Track Orders**: View order history and status

### For Admins
1. **Access Admin Panel**: Login with admin credentials
2. **Manage Products**: Add, edit, delete sweets
3. **Upload Images**: Add product photos
4. **Monitor Inventory**: Track stock and restock items
5. **View Analytics**: Check statistics and alerts

## 💳 Payment Integration

### Razorpay Setup
- **Test Key**: `rzp_test_Rd500r9Qey3onm`
- **Test Secret**: `d2n4sEOQYY73Dj7DFy0VW4UH`
- Automatically loads Razorpay checkout script
- Handles payment success/failure callbacks
- Integrates with order processing

### Test Payment Details
Use Razorpay test cards for testing:
- **Card Number**: 4111 1111 1111 1111
- **Expiry**: Any future date
- **CVV**: Any 3 digits

## 🎨 Key Components

### Core Components
- **SweetCard**: Product display with quick view
- **Checkout**: Multi-step payment process
- **SearchAndFilter**: Advanced filtering system
- **QuickView**: Product detail modal
- **OrderHistory**: Order tracking interface
- **AdminPanel**: Complete admin dashboard

### Utility Components
- **LoadingSpinner**: Custom loading animations
- **NotificationSystem**: Toast notifications
- **ErrorBoundary**: Error handling
- **Navbar**: Navigation with cart/user info

## 🔒 Security Features

- **JWT Authentication** with automatic token management
- **Role-based Access Control** (Admin/Customer)
- **Axios Interceptors** for automatic auth headers
- **Input Validation** on all forms
- **Secure Payment Processing** via Razorpay
- **Error Boundaries** for graceful error handling

## 📱 Responsive Design

- **Mobile-first** approach with Tailwind CSS
- **Touch-friendly** interfaces for mobile devices
- **Adaptive layouts** for tablets and desktops
- **Optimized images** and loading states
- **Smooth animations** across all devices

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for theme changes
- Update gradients in component classes
- Customize animations in `src/index.css`
- Add new color schemes easily

### Components
- All components are modular and reusable
- Props-based configuration
- Easy to extend functionality
- Consistent design patterns

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
```env
VITE_API_BASE_URL=https://your-api-domain.com
VITE_RAZORPAY_KEY_ID=your_live_razorpay_key
```

### Deploy Options
- **Vercel**: Connect GitHub repo for auto-deployment
- **Netlify**: Drag & drop build folder
- **AWS S3**: Static website hosting
- **Firebase Hosting**: Google's hosting solution

## 🔧 Development

### Project Structure
```
src/
├── api/           # API configuration and services
├── components/    # Reusable UI components
├── pages/         # Route components
├── services/      # Business logic services
├── App.jsx        # Main app component
└── main.jsx       # Entry point
```

### Code Quality
- ESLint configuration for code standards
- Consistent naming conventions
- Modular component architecture
- Proper error handling throughout

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support:
- Create an issue in the repository
- Check existing documentation
- Contact the development team

## 🎉 Acknowledgments

- **React Team** for the amazing framework
- **Tailwind CSS** for utility-first styling
- **Razorpay** for seamless payment integration
- **Lucide** for beautiful icons
- **Vite** for lightning-fast development

---

**Made with ❤️ for sweet lovers everywhere! 🍭🍬🧁**