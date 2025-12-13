import axiosInstance from '../api/axiosConfig';
import { apiEndpoints } from '../api/apiEndpoints';
import { config } from '../config/env.js';

// Razorpay Configuration
const RAZORPAY_KEY_ID = config.razorpay.keyId;

// Check if Razorpay script is loaded
export const isRazorpayLoaded = () => {
  return typeof window !== 'undefined' && window.Razorpay;
};

// Load Razorpay script dynamically (fallback if not loaded via HTML)
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    // Check if already loaded
    if (isRazorpayLoaded()) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Create payment order via backend
export const createPaymentOrder = async (orderData) => {
  try {
    const response = await axiosInstance.post(apiEndpoints.CREATE_ORDER, {
      amount: orderData.amount,
      currency: orderData.currency || 'INR',
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      items: orderData.items || []
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating payment order:', error);
    throw new Error(error.response?.data?.message || 'Failed to create payment order');
  }
};

// Verify payment via backend
export const verifyPayment = async (paymentData) => {
  try {
    const response = await axiosInstance.post(apiEndpoints.VERIFY_PAYMENT, {
      razorpay_order_id: paymentData.orderId,
      razorpay_payment_id: paymentData.paymentId,
      razorpay_signature: paymentData.signature
    });
    
    return response.data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw new Error(error.response?.data?.message || 'Payment verification failed');
  }
};

// Initialize Razorpay payment with backend integration
export const initiatePayment = async (orderData, onSuccess, onFailure) => {
  try {
    const isLoaded = await loadRazorpayScript();
    
    if (!isLoaded) {
      onFailure('Failed to load Razorpay SDK');
      return;
    }

    // Validate required data
    if (!orderData.amount || orderData.amount <= 0) {
      onFailure('Invalid payment amount');
      return;
    }

    // Create order via backend
    const backendOrder = await createPaymentOrder({
      amount: orderData.amount,
      currency: 'INR',
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      items: orderData.items
    });

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: backendOrder.amount, // Amount from backend (already in paise)
      currency: backendOrder.currency,
      name: 'Sweet Shop',
      description: 'Purchase from Sweet Shop',
      image: '/vite.svg',
      order_id: backendOrder.orderId, // Use backend order ID
      handler: async function (response) {
        try {
          // Verify payment with backend
          const verificationResult = await verifyPayment({
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature
          });
          
          // Payment verified successfully
          onSuccess({
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            verified: true,
            verificationData: verificationResult
          });
        } catch (verificationError) {
          console.error('Payment verification failed:', verificationError);
          onFailure(`Payment verification failed: ${verificationError.message}`);
        }
      },
      prefill: {
        name: orderData.customerName || '',
        email: orderData.customerEmail || '',
        contact: orderData.customerPhone || '',
      },
      notes: {
        address: 'Sweet Shop Corporate Office',
        order_type: 'sweet_purchase'
      },
      theme: {
        color: '#8B5CF6', // Purple theme
      },
      modal: {
        ondismiss: function() {
          onFailure('Payment cancelled by user');
        },
        escape: true,
        backdropclose: false
      }
    };

    const rzp = new window.Razorpay(options);
    
    // Add error handler
    rzp.on('payment.failed', function (response) {
      console.error('Payment failed:', response.error);
      onFailure(`Payment failed: ${response.error.description || 'Unknown error'}`);
    });

    rzp.open();
  } catch (error) {
    console.error('Error initiating payment:', error);
    onFailure(`Payment initialization failed: ${error.message}`);
  }
};

// Test Razorpay configuration
export const testRazorpayConfig = () => {
  return {
    keyId: RAZORPAY_KEY_ID,
    isLoaded: isRazorpayLoaded(),
    razorpayObject: !!window.Razorpay,
    backendEndpoints: {
      createOrder: apiEndpoints.CREATE_ORDER,
      verifyPayment: apiEndpoints.VERIFY_PAYMENT
    }
  };
};