# 🛠️ Development Guide - Sweet Shop

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🔧 Troubleshooting Common Issues

### JSON Parsing Errors
If you encounter `"undefined" is not valid JSON` errors:

1. **Clear Browser Storage**: Open DevTools → Application → Storage → Clear All
2. **Check API Response**: Ensure your backend returns proper JSON with `user` and `token` fields
3. **Verify Backend**: Make sure your API is running on `http://localhost:8080`

### Authentication Issues
- The app expects JWT tokens from your backend
- User object should contain `username` and `role` fields
- Admin users need `role: 'ADMIN'` to access admin panel

### Payment Integration
- Uses Razorpay test credentials: `rzp_test_Rd500r9Qey3onm`
- Test payments with card: `4111 1111 1111 1111`
- No real money is charged in test mode

## 🧪 Testing the Application

### 1. Landing Page (No Auth Required)
- Visit `http://localhost:5173`
- Should show sample products
- Login/Register buttons should work

### 2. User Registration
- Click "Sign Up" 
- Fill form and submit
- Should redirect to login page

### 3. User Login
- Use registered credentials
- Should redirect to dashboard
- Cart and shopping features should work

### 4. Admin Access
- Login with admin credentials
- Should see "Admin Panel" button
- Can manage products and inventory

### 5. Shopping Flow
1. Add items to cart
2. Click cart icon
3. Proceed to checkout
4. Fill delivery details
5. Complete payment with Razorpay

## 📁 Project Structure

```
src/
├── api/              # API configuration
│   ├── axiosConfig.js    # Axios setup with interceptors
│   ├── apiEndpoints.js   # API endpoint definitions
│   └── sweetService.js   # Sweet-specific API calls
├── components/       # Reusable UI components
│   ├── SweetCard.jsx     # Product card component
│   ├── Checkout.jsx      # Payment checkout flow
│   ├── QuickView.jsx     # Product detail modal
│   ├── SearchAndFilter.jsx # Advanced filtering
│   ├── OrderHistory.jsx  # Order tracking
│   ├── NotificationSystem.jsx # Toast notifications
│   ├── LoadingSpinner.jsx # Loading states
│   ├── ErrorBoundary.jsx # Error handling
│   └── Footer.jsx        # Site footer
├── pages/            # Route components
│   ├── LandingPage.jsx   # Public homepage
│   ├── Login.jsx         # User authentication
│   ├── Register.jsx      # User registration
│   ├── Dashboard.jsx     # Main shopping interface
│   └── AdminPanel.jsx    # Admin management
├── services/         # Business logic
│   └── paymentService.js # Razorpay integration
├── utils/            # Utility functions
│   └── storage.js        # Safe localStorage operations
├── App.jsx           # Main app component
└── main.jsx          # Entry point
```

## 🔧 Backend Configuration Fixes

### Spring Security Configuration Issues

Your current backend configuration has CORS and authentication issues. Here's the corrected version:

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .csrf(AbstractHttpConfigurer::disable)
        .authorizeHttpRequests(auth -> auth
            // PUBLIC PATHS - No authentication required
            .requestMatchers("/api/auth/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/sweets/public").permitAll() // Optional: public endpoint
            
            // ADMIN ONLY PATHS
            .requestMatchers(HttpMethod.POST, "/api/sweets/*/restock").hasRole("ADMIN")
            .requestMatchers(HttpMethod.POST, "/api/sweets").hasRole("ADMIN")
            .requestMatchers(HttpMethod.PUT, "/api/sweets/**").hasRole("ADMIN")
            .requestMatchers(HttpMethod.DELETE, "/api/sweets/**").hasRole("ADMIN")
            .requestMatchers("/api/admin/**").hasRole("ADMIN")
            
            // AUTHENTICATED PATHS - Normal users allowed
            .requestMatchers("/api/sweets/**").authenticated()
            
            // EVERYTHING ELSE REQUIRES AUTH
            .anyRequest().authenticated()
        )
        .sessionManagement(session ->
            session.sessionCreationPolicy(Sess

#### Authentication
```
POST /api/auth/register
Body: { firstname, lastname, email, password }
Response: { message: "User registered successfully" }

POST /api/auth/login  
Body: { email, password }
Response: { token: "jwt_token", user: { username, role, ... } }
```

#### Sweets Management
```
GET /api/sweets
Headers: { Authorization: "Bearer jwt_token" }
Response: [{ id, name, category, price, quantity, imageUrl }]

POST /api/sweets (Admin only)
Body: { name, category, price, quantity }

PUT /api/sweets/:id (Admin only)
Body: { name, category, price, quantity }

DELETE /api/sweets/:id (Admin only)

POST /api/sweets/:id/upload-image (Admin only)
Body: FormData with image file

POST /api/sweets/:id/restock (Admin only)
Body: { quantity }

POST /api/sweets/:id/purchase
Body: { quantity }
```

## 🎨 Customization

### Styling
- Uses Tailwind CSS for styling
- Custom animations in `src/index.css`
- Gradient themes throughout
- Responsive design patterns

### Components
- All components accept props for customization
- Consistent design system
- Modular and reusable
- Easy to extend functionality

### API Configuration
- Change `API_BASE_URL` in `src/api/apiEndpoints.js`
- Modify Razorpay keys in `src/services/paymentService.js`
- Update axios interceptors in `src/api/axiosConfig.js`

## 🐛 Debugging

### Common Issues

1. **CORS Errors**: Ensure backend allows requests from `http://localhost:5173`
2. **401/403 Errors**: Check JWT token format and expiration
3. **Payment Failures**: Verify Razorpay credentials and test mode
4. **Image Upload**: Ensure backend accepts multipart/form-data

### Debug Tools
- React DevTools for component inspection
- Network tab for API calls
- Console for error messages
- Local Storage for auth tokens

### Logging
- API errors logged to console
- User actions show toast notifications
- Network requests visible in DevTools
- Error boundary catches React errors

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
Create `.env` file:
```
VITE_API_BASE_URL=https://your-api-domain.com
VITE_RAZORPAY_KEY_ID=your_live_razorpay_key
```

### Deploy Options
- **Vercel**: `vercel --prod`
- **Netlify**: Drag & drop `dist` folder
- **AWS S3**: Upload `dist` contents
- **Firebase**: `firebase deploy`

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Clear browser cache and storage
3. Verify backend API is running
4. Check console for error messages
5. Create an issue with error details

---

**Happy Development! 🍬✨**