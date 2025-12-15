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


# My AI Usage.........................................................

## AI Tools Used

Throughout the development of this Sweet Shop Management System, I leveraged AI tools to enhance productivity, debug issues, and implement best practices. Below is a comprehensive overview of how AI assisted in this project.

### Tools Utilized
- **Claude AI (Anthropic)** - Primary AI assistant for code generation, debugging, and architecture decisions
- **GitHub Copilot** (if you used it) - Code completion and suggestions
- **ChatGPT** (if you used it) - Problem-solving and research

---

## How AI Was Used

### 1. Backend Development (Spring Boot)

#### Security Configuration & CORS Setup
- **AI Assistance**: Claude AI helped design and troubleshoot the Spring Security configuration, particularly the CORS settings for cross-origin requests between the Vercel frontend and Render backend.
- **Specific Tasks**:
  - Generated the initial `SecurityConfig.java` with proper CORS configuration
  - Debugged 403 Forbidden errors related to CORS and JWT authentication
  - Helped implement proper request matchers for public vs authenticated endpoints
- **My Contribution**: Customized the security rules based on application requirements, added role-based access control for admin endpoints, and integrated it with the existing authentication system.

#### JWT Authentication Implementation
- **AI Assistance**: Claude provided the structure for `JwtAuthenticationFilter.java` and `JwtService.java`
- **Specific Tasks**:
  - Generated boilerplate code for JWT token generation and validation
  - Helped resolve the WeakKeyException by suggesting a 256-bit secret key
  - Provided the `shouldNotFilter()` method to skip JWT validation for public endpoints
- **My Contribution**: Integrated JWT with the user authentication flow, customized token expiration times, and added proper error handling.

#### Entity Design & Relationships
- **AI Assistance**: Used AI to brainstorm the database schema and JPA entity relationships
- **Specific Tasks**:
  - Suggested appropriate annotations for entities (Sweet, User, Order)
  - Helped design the many-to-one and one-to-many relationships
- **My Contribution**: Refined the schema based on business requirements, added custom validation constraints, and implemented cascading rules.

#### Repository & Service Layer
- **AI Assistance**: AI generated initial repository interfaces and service class structures
- **Specific Tasks**:
  - Created CRUD operation templates
  - Suggested custom query methods for search functionality
  - Provided exception handling patterns
- **My Contribution**: Implemented business logic, added transaction management, and created custom search algorithms for sweet filtering.

#### API Controller Logic
- **AI Assistance**: Claude helped structure RESTful endpoints with proper HTTP methods and status codes
- **Specific Tasks**:
  - Generated controller method signatures
  - Suggested DTO (Data Transfer Object) patterns
  - Provided input validation examples
- **My Contribution**: Implemented the actual business logic, added comprehensive error responses, and integrated with the service layer.

---

### 2. Frontend Development (React + Vite)

#### API Configuration & Axios Setup
- **AI Assistance**: Claude identified and fixed issues with the axios configuration causing API call failures
- **Specific Tasks**:
  - Debugged the double baseURL problem in `apiEndpoints.js`
  - Suggested proper axios interceptor patterns for token management
  - Helped implement automatic token refresh logic
- **My Contribution**: Customized the error handling, added retry logic, and integrated with the authentication context.

#### Authentication Context & State Management
- **AI Assistance**: AI provided the structure for React Context API implementation
- **Specific Tasks**:
  - Generated the initial `AuthContext.js` with login/logout functions
  - Suggested localStorage management patterns
  - Provided protected route component structure
- **My Contribution**: Enhanced the context with user role management, added token expiration checks, and implemented auto-logout on token expiry.

#### Component Design & Styling
- **AI Assistance**: Used AI for component structure suggestions and Tailwind CSS class combinations
- **Specific Tasks**:
  - Suggested responsive design patterns
  - Provided gradient and animation class combinations
  - Helped debug layout issues
- **My Contribution**: Designed the overall UI/UX, created custom animations, and ensured mobile responsiveness.

#### Form Validation & Error Handling
- **AI Assistance**: AI provided validation logic patterns and error message strategies
- **Specific Tasks**:
  - Suggested react-hook-form integration
  - Generated validation schema examples
  - Provided error display component patterns
- **My Contribution**: Customized validation rules based on business requirements, added real-time validation feedback, and improved user experience.

---

### 3. Testing & Debugging

#### Unit Testing
- **AI Assistance**: Claude generated test case templates and helped structure test suites
- **Specific Tasks**:
  - Created JUnit test templates for service layer
  - Suggested Jest test patterns for React components
  - Provided mocking strategies for external dependencies
- **My Contribution**: Wrote actual test assertions, added edge case tests, and achieved high code coverage.

#### Bug Fixing & Troubleshooting
- **AI Assistance**: Used AI extensively for debugging deployment issues
- **Specific Tasks**:
  - Diagnosed the JWT WeakKeyException
  - Resolved CORS 403 Forbidden errors
  - Fixed axios configuration issues
  - Helped troubleshoot Render deployment problems
- **My Contribution**: Analyzed error logs, implemented fixes, and tested solutions across different environments.

---

### 4. DevOps & Deployment

#### Environment Configuration
- **AI Assistance**: Claude helped structure environment variables for both frontend and backend
- **Specific Tasks**:
  - Suggested proper `.env` file organization
  - Provided Render and Vercel configuration examples
  - Helped secure sensitive information
- **My Contribution**: Configured actual deployment environments, set up CI/CD pipelines, and managed secrets.

#### Docker & Containerization (if applicable)
- **AI Assistance**: AI provided Dockerfile templates and docker-compose configurations
- **My Contribution**: Customized containers for the specific application needs and optimized image sizes.

---

## Reflection on AI Impact

### Positive Impacts

1. **Accelerated Development**: AI significantly reduced the time spent on boilerplate code and common patterns, allowing me to focus on business logic and unique features.

2. **Learning Opportunity**: When AI suggested solutions, I took time to understand the underlying concepts, which expanded my knowledge of Spring Security, JWT authentication, and React best practices.

3. **Debugging Efficiency**: AI helped quickly identify root causes of errors (like the JWT WeakKeyException) that might have taken hours to debug manually.

4. **Best Practices**: AI consistently suggested industry-standard patterns and security best practices, improving code quality.

5. **Documentation**: AI helped structure clear documentation and README files, making the project more maintainable.

### Challenges & Limitations

1. **Context Understanding**: Sometimes AI suggestions needed significant modification to fit the specific project requirements and existing architecture.

2. **Over-reliance Risk**: I had to be careful not to blindly accept AI-generated code without understanding it, as this could lead to security vulnerabilities or design issues.

3. **Debugging AI Code**: Occasionally, AI-generated code had subtle bugs that required careful review and testing to identify.

### My Approach to Using AI Responsibly

1. **Always Review**: I never committed AI-generated code without thoroughly reviewing and understanding it.

2. **Test Everything**: All AI-generated code went through rigorous testing before integration.

3. **Customize**: I used AI as a starting point, then customized the code to fit my specific needs and coding standards.

4. **Learn**: I treated AI suggestions as learning opportunities, researching concepts I didn't fully understand.

5. **Attribution**: I maintained transparency by documenting AI usage and adding co-author tags to relevant commits.

---

## Conclusion

AI tools were invaluable throughout this project, acting as a knowledgeable pair programmer and debugging assistant. However, the core architecture decisions, business logic implementation, and overall project direction remained my responsibility. AI enhanced my productivity without replacing critical thinking and problem-solving skills.

The combination of human creativity and AI efficiency resulted in a robust, well-tested, and production-ready application that I'm proud to present.