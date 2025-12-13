# Deployment Guide

## Environment Variables Setup

### Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:8080

# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Application Configuration
VITE_APP_NAME=Sweet Shop
VITE_APP_VERSION=1.0.0

# Environment
NODE_ENV=production
```

### For Different Environments

#### Development
```bash
VITE_API_BASE_URL=http://localhost:8080
NODE_ENV=development
```

#### Production
```bash
VITE_API_BASE_URL=https://your-production-api.com
NODE_ENV=production
```

#### Staging
```bash
VITE_API_BASE_URL=https://your-staging-api.com
NODE_ENV=staging
```

## Deployment Platforms

### Vercel
1. Connect your GitHub repository
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Traditional Hosting
1. Build the project: `npm run build`
2. Upload the `dist` folder to your web server
3. Configure environment variables on your server

## Security Notes

- Never commit `.env` files to version control
- Use different API keys for development and production
- Rotate API keys regularly
- Use HTTPS in production
- Validate all environment variables on startup

## Environment Variable Validation

The application automatically validates required environment variables on startup. Check the browser console for any missing variables.

## Troubleshooting

### Common Issues

1. **API calls failing**: Check `VITE_API_BASE_URL` is correct
2. **Payment not working**: Verify Razorpay keys are valid
3. **Build failing**: Ensure all required env vars are set

### Debug Mode

Set `NODE_ENV=development` to enable debug logging and detailed error messages.