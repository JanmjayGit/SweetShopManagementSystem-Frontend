# 🔧 Troubleshooting Guide

## ✅ **Issue Fixed: LandingPage API Import**

**Problem**: The LandingPage was using direct `axios` import instead of the configured `axiosInstance`.

**Solution Applied**:
- Changed `import axios from 'axios'` to `import axiosInstance from '../api/axiosConfig'`
- Updated API call to use `axiosInstance.get()` instead of `axios.get()`

## 🚀 **Current Status**

- ✅ **Backend Connection**: Working (`https://sweetshopmanagementsystem-backend.onrender.com`)
- ✅ **CORS Configuration**: Properly configured
- ✅ **Environment Variables**: Loaded correctly
- ✅ **Build Process**: Successful
- ✅ **Development Server**: Running on `http://localhost:5174`

## 🔍 **Common Issues & Solutions**

### 1. **CORS Errors**
**Symptoms**: 
- "Access to fetch blocked by CORS policy"
- Network requests failing in browser

**Solutions**:
- Ensure backend allows your frontend origin
- Check that backend CORS configuration includes your domain
- Verify preflight OPTIONS requests are handled

**Test CORS**:
```bash
curl -H "Origin: http://localhost:5174" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://sweetshopmanagementsystem-backend.onrender.com/api/sweets
```

### 2. **Environment Variables Not Loading**
**Symptoms**:
- API calls going to wrong URL
- "Missing environment variables" warnings

**Solutions**:
- Ensure `.env` file exists in root directory
- Restart development server after changing `.env`
- Check variable names start with `VITE_`

**Debug Environment**:
Open browser console and check for environment debug logs.

### 3. **Backend Connection Issues**
**Symptoms**:
- Network errors
- Timeout errors
- 500 server errors

**Solutions**:
- Check if backend is running: `curl https://sweetshopmanagementsystem-backend.onrender.com/api/sweets`
- Verify backend URL in `.env` file
- Check Render dashboard for backend status

### 4. **Authentication Issues**
**Symptoms**:
- 401 Unauthorized errors
- Automatic logout
- Token not being sent

**Solutions**:
- Check JWT token format in localStorage
- Verify token is being added to Authorization header
- Ensure backend accepts Bearer tokens

### 5. **Payment Integration Issues**
**Symptoms**:
- Razorpay not loading
- Payment creation failing
- Verification errors

**Solutions**:
- Check Razorpay keys in `.env`
- Ensure HTTPS is used (required by Razorpay)
- Verify payment endpoints are implemented in backend

## 🛠️ **Debug Steps**

### Step 1: Check Environment
```bash
# Verify environment variables
cat .env

# Check if backend is accessible
curl https://sweetshopmanagementsystem-backend.onrender.com/api/sweets
```

### Step 2: Check Browser Console
1. Open browser developer tools (F12)
2. Go to Console tab
3. Look for error messages or warnings
4. Check Network tab for failed requests

### Step 3: Test API Endpoints
```bash
# Test GET sweets
curl https://sweetshopmanagementsystem-backend.onrender.com/api/sweets

# Test login (replace with actual credentials)
curl -X POST https://sweetshopmanagementsystem-backend.onrender.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password"}'
```

### Step 4: Check Network Requests
1. Open browser Network tab
2. Reload the page
3. Check if API requests are being made
4. Look for failed requests (red status codes)
5. Check request headers and responses

## 📋 **Health Check Checklist**

- [ ] Backend is running and accessible
- [ ] CORS is properly configured
- [ ] Environment variables are loaded
- [ ] Frontend builds without errors
- [ ] Development server starts successfully
- [ ] API requests use correct base URL
- [ ] Authentication tokens are handled properly

## 🆘 **Emergency Reset**

If nothing works, try this complete reset:

```bash
# 1. Stop development server
# Ctrl+C or stop the process

# 2. Clear node modules and reinstall
rm -rf node_modules
rm -rf dist
npm install

# 3. Verify environment
cp .env.example .env
# Edit .env with correct values

# 4. Test build
npm run build

# 5. Start development server
npm run dev
```

## 📞 **Getting Help**

If issues persist:

1. **Check browser console** for specific error messages
2. **Check network tab** for failed API requests
3. **Test backend directly** with curl commands
4. **Verify environment variables** are loaded correctly
5. **Check Render dashboard** for backend logs

## 🎯 **Quick Fixes**

### Fix 1: Clear Browser Cache
- Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Clear localStorage: Open console and run `localStorage.clear()`

### Fix 2: Restart Development Server
```bash
# Stop server (Ctrl+C)
# Then restart
npm run dev
```

### Fix 3: Check Port Conflicts
If port 5173 is in use, Vite will use 5174. Update any hardcoded URLs accordingly.

### Fix 4: Verify Backend Status
Visit your Render dashboard to ensure the backend service is running and not sleeping.

---

**🎉 Your Sweet Shop should now be working correctly!**