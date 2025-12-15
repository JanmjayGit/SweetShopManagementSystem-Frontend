
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://sweetshopmanagementsystem-backend.onrender.com';

export const apiEndpoints = {
    // Auth endpoints
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    
    // Sweet endpoints
    ADD_SWEET: '/api/sweets',
    GET_ALL_SWEETS: '/api/sweets',
    SEARCH: '/api/sweets/search',
    UPDATE_SWEET: (id) => `/api/sweets/${id}`,
    DELETE_SWEET: (id) => `/api/sweets/${id}`,
    PURCHASE: (id) => `/api/sweets/${id}/purchase`,
    RESTOCK: (id) => `/api/sweets/${id}/restock`,
    UPLOAD_IMAGE: (id) => `/api/sweets/${id}/upload-image`,
    
    // Payment endpoints
    CREATE_ORDER: '/api/payment/create-order',
    VERIFY_PAYMENT: '/api/payment/verify-payment',
};

export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;