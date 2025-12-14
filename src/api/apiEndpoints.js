import { config } from '../config/env.js';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiEndpoints = {
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    ADD_SWEET: `${API_BASE_URL}/api/sweets`,
    GET_ALL_SWEETS: `${API_BASE_URL}/api/sweets`,
    SEARCH: `${API_BASE_URL}/api/sweets/search`,
    UPDATE_SWEET: (id) => `${API_BASE_URL}/api/sweets/${id}`,
    DELETE_SWEET: (id) => `${API_BASE_URL}/api/sweets/${id}`,
    PURCHASE: (id) => `${API_BASE_URL}/api/sweets/${id}/purchase`,
    RESTOCK: (id) => `${API_BASE_URL}/api/sweets/${id}/restock`,
    UPLOAD_IMAGE: (id) => `${API_BASE_URL}/api/sweets/${id}/upload-image`,
    
    // Payment endpoints
    CREATE_ORDER: `${API_BASE_URL}/api/payment/create-order`,
    VERIFY_PAYMENT: `${API_BASE_URL}/api/payment/verify-payment`,
};

export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;
