import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { 
  CreditCard, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShoppingBag,
  Lock,
  CheckCircle,
  X
} from 'lucide-react';
import { initiatePayment, testRazorpayConfig } from '../services/paymentService';
import axiosInstance from '../api/axiosConfig';
import { apiEndpoints } from '../api/apiEndpoints';

const Checkout = ({ cart, totalAmount, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Success
  const [orderDetails, setOrderDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    notes: ''
  });

  const handleInputChange = (e) => {
    setOrderDetails({
      ...orderDetails,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const required = ['name', 'email', 'phone', 'address', 'city', 'pincode'];
    for (let field of required) {
      if (!orderDetails[field]) {
        toast.error(`Please fill in ${field}`);
        return false;
      }
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(orderDetails.email)) {
      toast.error('Please enter a valid email');
      return false;
    }
    
    // Phone validation
    if (orderDetails.phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return false;
    }
    
    return true;
  };

  const handleProceedToPayment = () => {
    if (validateForm()) {
      setStep(2);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // Validate amount
      if (!totalAmount || totalAmount <= 0) {
        toast.error('Invalid payment amount');
        setLoading(false);
        return;
      }

      // Prepare order data for backend
      const orderData = {
        amount: totalAmount,
        currency: 'INR',
        customerName: orderDetails.name,
        customerEmail: orderDetails.email,
        customerPhone: orderDetails.phone,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.cartQuantity
        }))
      };
      
      // Initiate Razorpay payment with backend integration
      await initiatePayment(
        orderData,
        async (paymentResponse) => {
          // Payment successful and verified - process the order
          await processOrder(paymentResponse);
        },
        (error) => {
          console.error('Payment failed:', error);
          toast.error(error || 'Payment failed');
          setLoading(false);
        }
      );
    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error(`Failed to initiate payment: ${error.message}`);
      setLoading(false);
    }
  };

  const processOrder = async (paymentResponse) => {
    try {
      // Process each item in the cart (update inventory)
      for (const item of cart) {
        await axiosInstance.post(apiEndpoints.PURCHASE(item.id), {
          quantity: item.cartQuantity
        });
      }
      
      // Save order details with payment information
      const orderRecord = {
        paymentId: paymentResponse.paymentId,
        orderId: paymentResponse.orderId,
        amount: totalAmount,
        customerDetails: orderDetails,
        items: cart,
        status: 'completed',
        timestamp: new Date().toISOString()
      };
      
      // Store order in localStorage for now (in production, save to backend)
      const existingOrders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      existingOrders.push(orderRecord);
      localStorage.setItem('orderHistory', JSON.stringify(existingOrders));
      
      setStep(3);
      toast.success('Order placed and payment verified successfully!');
      
      // Call success callback after a delay
      setTimeout(() => {
        onSuccess();
      }, 2000);
      
    } catch (error) {
      toast.error('Failed to process order after payment');
      console.error('Order processing error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 opacity-20 animate-pulse">
        <ShoppingBag className="w-24 h-24 text-indigo-400" />
      </div>
      <div className="absolute bottom-10 left-10 opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}>
        <CreditCard className="w-20 h-20 text-purple-400" />
      </div>
      <div className="absolute top-1/2 left-10 opacity-10 animate-bounce" style={{ animationDelay: '0.2s' }}>
        <Lock className="w-16 h-16 text-pink-400" />
      </div>
      <div className="absolute bottom-1/3 right-1/4 opacity-15 animate-pulse" style={{ animationDelay: '1s' }}>
        <CheckCircle className="w-18 h-18 text-purple-300" />
      </div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all hover:scale-105 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-full p-3 shadow-lg">
                {step === 1 && <User className="w-8 h-8 text-purple-500" />}
                {step === 2 && <CreditCard className="w-8 h-8 text-purple-500" />}
                {step === 3 && <CheckCircle className="w-8 h-8 text-green-500" />}
              </div>
              <div>
                <h2 className="text-3xl font-bold">
                  {step === 1 && 'Delivery Details'}
                  {step === 2 && 'Payment'}
                  {step === 3 && 'Order Confirmed'}
                </h2>
                <p className="text-pink-100 mt-1">
                  {step === 1 && 'Enter your delivery information'}
                  {step === 2 && 'Complete your payment securely'}
                  {step === 3 && 'Your order has been placed successfully'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center mt-4 space-x-4">
            <div className={`flex items-center ${step >= 1 ? 'text-white' : 'text-pink-200'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-white text-purple-500' : 'bg-pink-300'}`}>
                1
              </div>
              <span className="ml-2 text-sm">Details</span>
            </div>
            <div className={`w-8 h-1 ${step >= 2 ? 'bg-white' : 'bg-pink-300'}`}></div>
            <div className={`flex items-center ${step >= 2 ? 'text-white' : 'text-pink-200'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-white text-purple-500' : 'bg-pink-300'}`}>
                2
              </div>
              <span className="ml-2 text-sm">Payment</span>
            </div>
            <div className={`w-8 h-1 ${step >= 3 ? 'bg-white' : 'bg-pink-300'}`}></div>
            <div className={`flex items-center ${step >= 3 ? 'text-white' : 'text-pink-200'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-white text-purple-500' : 'bg-pink-300'}`}>
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="ml-2 text-sm">Done</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Delivery Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={orderDetails.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={orderDetails.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={orderDetails.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Address *
                </label>
                <textarea
                  name="address"
                  value={orderDetails.address}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="Enter your complete address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={orderDetails.city}
                    onChange={handleInputChange}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    placeholder="Enter your city"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={orderDetails.pincode}
                    onChange={handleInputChange}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    placeholder="Enter pincode"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Special Instructions (Optional)
                </label>
                <textarea
                  name="notes"
                  value={orderDetails.notes}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="Any special delivery instructions..."
                />
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mt-6">
                <h3 className="font-bold text-lg mb-3">Order Summary</h3>
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} x {item.cartQuantity}</span>
                      <span>₹{(item.price * item.cartQuantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 font-bold text-lg">
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span>₹{totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleProceedToPayment}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
              >
                Proceed to Payment
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="text-center space-y-6">
              <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg p-6">
                <ShoppingBag className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Ready to Pay</h3>
                <p className="text-gray-600 mb-4">
                  You're about to pay ₹{totalAmount.toFixed(2)} for your sweet treats
                </p>
                
                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
                    <Lock className="w-4 h-4" />
                    <span>Secured by Razorpay</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Your payment information is encrypted and secure
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-4 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>Pay ₹{totalAmount.toFixed(2)}</span>
                    </>
                  )}
                </button>
                
                {/* Test Button - Remove in production */}
                <button
                  onClick={() => {
                    const config = testRazorpayConfig();
                    console.log('Razorpay Config Test:', config);
                    toast.success(`Razorpay ${config.isLoaded ? 'Loaded' : 'Not Loaded'}`);
                    console.log('Backend endpoints:', config.backendEndpoints);
                  }}
                  className="w-full bg-gray-500 text-white py-2 rounded-lg text-sm"
                >
                  Test Payment Config
                </button>
              </div>

              <button
                onClick={() => setStep(1)}
                className="w-full text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Back to Details
              </button>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="text-center space-y-6">
              <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-lg p-8">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h3>
                <p className="text-gray-600 mb-4">
                  Thank you for your purchase. Your payment has been verified and your sweet treats are being prepared!
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white rounded-lg p-4 text-left">
                    <h4 className="font-bold mb-2">Delivery Details:</h4>
                    <p className="text-sm text-gray-600">{orderDetails.name}</p>
                    <p className="text-sm text-gray-600">{orderDetails.address}</p>
                    <p className="text-sm text-gray-600">{orderDetails.city}, {orderDetails.pincode}</p>
                    <p className="text-sm text-gray-600">{orderDetails.phone}</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 text-left">
                    <h4 className="font-bold mb-2">Payment Details:</h4>
                    <p className="text-sm text-gray-600">Amount: ₹{totalAmount.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Status: ✅ Verified</p>
                    <p className="text-sm text-gray-600">Method: Razorpay</p>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-gray-500">
                  You will receive a confirmation email shortly with your order details.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;