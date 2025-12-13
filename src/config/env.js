// Environment Configuration
// This file centralizes all environment variable access

export const config = {
  // API Configuration
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  
  // Razorpay Configuration
  razorpay: {
    keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_Rd500r9Qey3onm',
    keySecret: import.meta.env.VITE_RAZORPAY_KEY_SECRET || 'd2n4sEOQYY73Dj7DFy0VW4UH',
  },
  
  // Application Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Sweet Shop',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  },
  
  // Environment
  isDevelopment: import.meta.env.NODE_ENV === 'development',
  isProduction: import.meta.env.NODE_ENV === 'production',
  
  // Validation function to check if all required env vars are present
  validate() {
    const required = [
      'VITE_API_BASE_URL',
      'VITE_RAZORPAY_KEY_ID'
    ];
    
    const missing = required.filter(key => !import.meta.env[key]);
    
    if (missing.length > 0) {
      console.warn('Missing environment variables:', missing);
      console.warn('Please check your .env file and ensure all required variables are set.');
    }
    
    return missing.length === 0;
  }
};

// Validate environment variables on import
config.validate();

export default config;