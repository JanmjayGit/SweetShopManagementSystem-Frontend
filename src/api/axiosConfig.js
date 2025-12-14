// axiosConfig.js
import axios from 'axios';
import { API_BASE_URL } from './apiEndpoints';

// Create axios instance with proper configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && token !== 'undefined' && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log the request for debugging (remove in production)
    console.log('API Request:', config.method.toUpperCase(), config.url);
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful responses (remove in production)
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    // Log errors for debugging
    console.error('API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.message || error.message
    });

    // Only logout on authentication errors (401)
    if (error.response?.status === 401) {
      // 401 means token is invalid/expired - logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if not already on login/register page
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        window.location.href = '/login';
      }
    }
    // 403 means insufficient permissions - don't logout, just let the error bubble up
    
    return Promise.reject(error);
  }
);

export default axiosInstance;