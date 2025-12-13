# Environment Setup Guide

## Quick Start

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Update the values in `.env` with your actual configuration:**
   ```bash
   # Backend API Configuration
   VITE_API_BASE_URL=http://localhost:8080

   # Razorpay Configuration (Get from Razorpay Dashboard)
   VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
   VITE_RAZORPAY_KEY_SECRET=your_key_secret

   # Application Configuration
   VITE_APP_NAME=Sweet Shop
   VITE_APP_VERSION=1.0.0

   # Environment
   NODE_ENV=development
   ```

3. **Install dependencies and start:**
   ```bash
   npm install
   npm run dev
   ```

## Environment Variables Explained

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:8080` |
| `VITE_RAZORPAY_KEY_ID` | Razorpay public key | `rzp_test_1234567890` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_RAZORPAY_KEY_SECRET` | Razorpay secret key | Used for backend validation |
| `VITE_APP_NAME` | Application name | `Sweet Shop` |
| `VITE_APP_VERSION` | Application version | `1.0.0` |
| `NODE_ENV` | Environment mode | `development` |

## Getting API Keys

### Razorpay Setup
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up or log in
3. Navigate to Settings → API Keys
4. Generate new keys for Test/Live mode
5. Copy the Key ID and Key Secret

### Backend API
- For development: `http://localhost:8080`
- For production: Your deployed backend URL

## Environment-Specific Configuration

### Development
```bash
VITE_API_BASE_URL=http://localhost:8080
VITE_RAZORPAY_KEY_ID=rzp_test_your_test_key
NODE_ENV=development
```

### Production
```bash
VITE_API_BASE_URL=https://api.yoursite.com
VITE_RAZORPAY_KEY_ID=rzp_live_your_live_key
NODE_ENV=production
```

## Security Best Practices

1. **Never commit `.env` files** - They're already in `.gitignore`
2. **Use different keys for different environments**
3. **Rotate API keys regularly**
4. **Use test keys for development**
5. **Use live keys only in production**

## Troubleshooting

### Common Issues

**Environment variables not loading:**
- Ensure variable names start with `VITE_`
- Restart the development server after changes
- Check for typos in variable names

**API calls failing:**
- Verify `VITE_API_BASE_URL` is correct
- Check if backend server is running
- Ensure no trailing slashes in URLs

**Payment integration not working:**
- Verify Razorpay keys are correct
- Check if keys match the environment (test/live)
- Ensure Razorpay script is loaded

### Debug Mode

The application automatically validates environment variables on startup. Check the browser console for validation messages.

## File Structure

```
├── .env                 # Your environment variables (not in git)
├── .env.example         # Template for environment variables
├── .gitignore          # Includes .env files
├── src/
│   └── config/
│       └── env.js      # Centralized environment configuration
└── deployment.md       # Deployment-specific guide
```