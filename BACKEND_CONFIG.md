# 🔧 Backend Configuration Guide

## 🚨 **Critical Issues in Your Current Config**

### 1. **CORS Configuration Problems**
Your current CORS setup has several issues that prevent proper authentication:

```java
// ❌ PROBLEMATIC CONFIGURATION
config.setAllowedOrigins(List.of("*"));  // Can't use "*" with credentials
config.setAllowCredentials(false);       // Blocks auth headers
```

### 2. **Missing OPTIONS Support**
Preflight requests (OPTIONS) are not explicitly allowed, causing CORS failures.

## ✅ **Corrected Spring Security Configuration**

**Important**: This configuration allows public access to view sweets on the landing page while keeping purchases and admin functions protected.

Replace your current configuration with this:

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .csrf(AbstractHttpConfigurer::disable)
        .authorizeHttpRequests(auth -> auth
            // PUBLIC PATHS - No authentication required
            .requestMatchers("/api/auth/**").permitAll()
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // ✅ Allow preflight
            .requestMatchers(HttpMethod.GET, "/api/sweets").permitAll() // ✅ Allow public viewing of sweets
            .requestMatchers(HttpMethod.GET, "/api/sweets/search").permitAll() // ✅ Allow public search
            
            // ADMIN ONLY PATHS
            .requestMatchers(HttpMethod.POST, "/api/sweets/*/restock").hasRole("ADMIN")
            .requestMatchers(HttpMethod.POST, "/api/sweets/*/upload-image").hasRole("ADMIN")
            .requestMatchers(HttpMethod.POST, "/api/sweets").hasRole("ADMIN")
            .requestMatchers(HttpMethod.PUT, "/api/sweets/**").hasRole("ADMIN")
            .requestMatchers(HttpMethod.DELETE, "/api/sweets/**").hasRole("ADMIN")
            .requestMatchers("/api/admin/**").hasRole("ADMIN")
            
            // AUTHENTICATED PATHS - Normal users allowed (purchasing, payment)
            .requestMatchers("/api/sweets/*/purchase").authenticated()
            .requestMatchers("/api/payment/**").authenticated()
            
            // EVERYTHING ELSE REQUIRES AUTH
            .anyRequest().authenticated()
        )
        .sessionManagement(session ->
            session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        )
        .authenticationProvider(authenticationProvider())
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
}

@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    
    // ✅ FIXED: Specific origins instead of "*"
    config.setAllowedOrigins(List.of(
        "http://localhost:5173",  // Vite dev server
        "http://localhost:3000",  // Alternative React dev server
        "https://sweetshopmanagementsystem-backend.onrender.com", // Production backend
        "https://your-frontend-domain.com" // Add your frontend domain when deployed
    ));
    
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true); // ✅ FIXED: Enable credentials
    config.setExposedHeaders(List.of("Authorization")); // ✅ Expose auth header

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
}
```

## 📝 **Required Response Formats**

### Login Endpoint Response
Your `/api/auth/login` currently returns (which is now handled by frontend):

```json
{
  "id": 1,
  "firstname": "John",
  "lastname": "Doe", 
  "email": "john@example.com",
  "role": "USER",  // or "ADMIN"
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Note**: The frontend now transforms this to the expected format internally.

### Register Endpoint Response
Your `/api/auth/register` should return:

```json
{
  "message": "User registered successfully"
}
```

### Error Response Format
All error responses should follow:

```json
{
  "message": "Error description",
  "status": 400,
  "timestamp": "2024-12-13T10:30:00Z"
}
```

## 🔐 **JWT Token Configuration**

### Token Format
Ensure your JWT tokens include:

```json
{
  "sub": "user@example.com",
  "role": "USER",
  "iat": 1639123456,
  "exp": 1639209856
}
```

### JWT Filter
Your `jwtAuthenticationFilter` should:

1. Extract token from `Authorization: Bearer <token>` header
2. Validate token signature and expiration
3. Set authentication in SecurityContext
4. Handle role-based authorization

## 🛠️ **Testing Your Backend**

### 1. Test CORS
```bash
curl -X OPTIONS https://sweetshopmanagementsystem-backend.onrender.com/api/sweets \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Authorization"
```

Should return CORS headers allowing the request.

### 2. Test Login
```bash
curl -X POST https://sweetshopmanagementsystem-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

Should return token and user object.

### 3. Test Protected Endpoint
```bash
curl -X GET https://sweetshopmanagementsystem-backend.onrender.com/api/sweets \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Should return sweets data.

## 🚨 **Common Issues & Solutions**

### Issue 1: CORS Preflight Failures
**Symptoms**: OPTIONS requests fail, browser shows CORS errors
**Solution**: Add `.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()`

### Issue 2: Credentials Not Sent
**Symptoms**: Authorization header missing in requests
**Solution**: Set `config.setAllowCredentials(true)` and use specific origins

### Issue 3: Token Not Recognized
**Symptoms**: 401 errors despite valid token
**Solution**: Check JWT filter order and token extraction logic

### Issue 4: Role-Based Access Fails
**Symptoms**: Admin endpoints return 403 for admin users
**Solution**: Ensure JWT contains correct role claim and Spring Security role mapping

## 📊 **Security Best Practices**

### 1. Token Security
- Use strong secret keys (256-bit minimum)
- Set appropriate expiration times (15-30 minutes for access tokens)
- Implement refresh token mechanism
- Validate token on every request

### 2. CORS Security
- Never use `"*"` for origins in production
- Limit allowed methods to what you actually use
- Be specific with allowed headers
- Monitor CORS logs for suspicious requests

### 3. Role Management
- Use enum for roles to prevent typos
- Implement hierarchical roles if needed
- Log role-based access attempts
- Regular security audits

## 🔄 **Development vs Production**

### Development Settings
```java
// Allow localhost origins
config.setAllowedOrigins(List.of(
    "http://localhost:5173",
    "http://localhost:3000"
));
```

### Production Settings
```java
// Use your actual domain
config.setAllowedOrigins(List.of(
    "https://yourdomain.com",
    "https://www.yourdomain.com"
));
```

## 📝 **Checklist**

Before deploying, ensure:

- [ ] CORS allows your frontend origin
- [ ] JWT tokens include required claims
- [ ] Role-based endpoints work correctly
- [ ] Error responses follow consistent format
- [ ] OPTIONS requests are handled
- [ ] Credentials are properly configured
- [ ] Security headers are set
- [ ] Logging is configured for debugging

## 💳 **Payment Integration Configuration**

### Required Backend Endpoints

Your backend needs to implement these payment endpoints:

#### 1. **Create Order Endpoint**
```java
@PostMapping("/api/payment/create-order")
@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest request) {
    // Implementation needed
}
```

**Request Body:**
```json
{
  "amount": 299.99,
  "currency": "INR",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "9876543210",
  "items": [
    {
      "id": 1,
      "name": "Chocolate Truffle",
      "price": 25.99,
      "quantity": 2
    }
  ]
}
```

**Response:**
```json
{
  "orderId": "order_razorpay_generated_id",
  "amount": 29999,
  "currency": "INR",
  "status": "created"
}
```

#### 2. **Verify Payment Endpoint**
```java
@PostMapping("/api/payment/verify-payment")
@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
public ResponseEntity<?> verifyPayment(@RequestBody VerifyPaymentRequest request) {
    // Implementation needed
}
```

**Request Body:**
```json
{
  "razorpay_order_id": "order_xyz123",
  "razorpay_payment_id": "pay_abc456",
  "razorpay_signature": "signature_hash"
}
```

**Response:**
```json
{
  "verified": true,
  "paymentId": "pay_abc456",
  "orderId": "order_xyz123",
  "status": "success"
}
```

### 🖼️ **Image Upload Endpoint**

Based on your implementation, you have:

```java
@PostMapping("/{id}/upload-image")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<Sweet> uploadImage(
    @PathVariable Long id,
    @RequestParam("file") MultipartFile file
) {
    return ResponseEntity.ok(sweetService.uploadImage(id, file));
}
```

**Cloudinary Configuration**: You're using Cloudinary for image storage, which is excellent! Make sure your `application.properties` includes:

```properties
# Cloudinary Configuration
cloudinary.cloud-name=your_cloud_name
cloudinary.api-key=your_api_key
cloudinary.api-secret=your_api_secret
```

### Backend Dependencies

Add these to your `pom.xml`:

```xml
<dependency>
    <groupId>com.razorpay</groupId>
    <artifactId>razorpay-java</artifactId>
    <version>1.4.3</version>
</dependency>
```

### Environment Configuration

Add to your `application.properties`:

```properties
# Razorpay Configuration
razorpay.key.id=rzp_test_Rd500r9Qey3onm
razorpay.key.secret=d2n4sEOQYY73Dj7DFy0VW4UH
```

### Sample Backend Implementation

```java
@RestController
@RequestMapping("/api/payment")
public class PaymentController {
    
    @Value("${razorpay.key.id}")
    private String razorpayKeyId;
    
    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;
    
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest request) {
        try {
            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", request.getAmount() * 100); // Convert to paise
            orderRequest.put("currency", request.getCurrency());
            orderRequest.put("receipt", "order_" + System.currentTimeMillis());
            
            Order order = razorpay.orders.create(orderRequest);
            
            CreateOrderResponse response = new CreateOrderResponse();
            response.setOrderId(order.get("id"));
            response.setAmount(order.get("amount"));
            response.setCurrency(order.get("currency"));
            response.setStatus("created");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Order creation failed: " + e.getMessage());
        }
    }
    
    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayment(@RequestBody VerifyPaymentRequest request) {
        try {
            // Verify signature
            String generatedSignature = hmacSha256(
                request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId(),
                razorpayKeySecret
            );
            
            if (generatedSignature.equals(request.getRazorpaySignature())) {
                VerifyPaymentResponse response = new VerifyPaymentResponse();
                response.setVerified(true);
                response.setPaymentId(request.getRazorpayPaymentId());
                response.setOrderId(request.getRazorpayOrderId());
                response.setStatus("success");
                
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body("Payment verification failed");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Verification failed: " + e.getMessage());
        }
    }
    
    private String hmacSha256(String data, String key) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(), "HmacSHA256");
        mac.init(secretKeySpec);
        byte[] hash = mac.doFinal(data.getBytes());
        return Hex.encodeHexString(hash);
    }
}
```

---

**Apply these changes to fix your authentication and payment issues! 🔐💳✨**