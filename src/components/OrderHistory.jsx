import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, Truck, MapPin, Calendar, X, ShoppingBag } from 'lucide-react';

const OrderHistory = ({ isOpen, onClose }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load real order data from localStorage
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      
      // Get orders from localStorage
      const storedOrders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      
      // Transform the stored orders to match our display format
      const transformedOrders = storedOrders.map((order, index) => ({
        id: `ORD-${String(index + 1).padStart(3, '0')}`,
        date: order.timestamp ? new Date(order.timestamp).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: order.status || 'delivered',
        total: order.amount || 0,
        items: order.items ? order.items.map(item => ({
          id: item.id, // Include product ID for navigation
          name: item.name,
          quantity: item.cartQuantity || item.quantity || 1,
          price: item.price
        })) : [],
        deliveryAddress: order.customerDetails ? 
          `${order.customerDetails.address}, ${order.customerDetails.city}, ${order.customerDetails.pincode}` : 
          'Address not available',
        paymentId: order.paymentId,
        orderId: order.orderId,
        trackingSteps: [
          { status: 'confirmed', time: new Date(order.timestamp).toLocaleTimeString(), completed: true },
          { status: 'preparing', time: 'Processing', completed: true },
          { status: 'shipped', time: 'In Transit', completed: order.status === 'delivered' },
          { status: 'delivered', time: order.status === 'delivered' ? 'Delivered' : 'Pending', completed: order.status === 'delivered' }
        ]
      }));

      // Add some sample orders if no real orders exist (for demo purposes)
      if (transformedOrders.length === 0) {
        const sampleOrders = [
          {
            id: 'SAMPLE-001',
            date: '2024-12-13',
            status: 'delivered',
            total: 245.50,
            items: [
              { id: '1', name: 'Chocolate Truffle', quantity: 2, price: 25.99 },
              { id: '2', name: 'Strawberry Delight', quantity: 3, price: 18.50 }
            ],
            deliveryAddress: '123 Sweet Street, Candy Lane, 560001',
            paymentId: 'sample_payment_1',
            trackingSteps: [
              { status: 'confirmed', time: '10:30 AM', completed: true },
              { status: 'preparing', time: '11:00 AM', completed: true },
              { status: 'shipped', time: '2:30 PM', completed: true },
              { status: 'delivered', time: '4:45 PM', completed: true }
            ]
          }
        ];
        setOrders(sampleOrders);
      } else {
        setOrders(transformedOrders);
      }
      
      setLoading(false);
    }
  }, [isOpen]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-blue-600 bg-blue-100';
      case 'preparing':
        return 'text-yellow-600 bg-yellow-100';
      case 'shipped':
        return 'text-purple-600 bg-purple-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'preparing':
        return <Clock className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <Package className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleReorder = (order) => {
    if (order.items && order.items.length > 0) {
      if (order.items.length === 1) {
        // Single item: navigate directly to product details
        const item = order.items[0];
        if (item.id) {
          navigate(`/sweet/${item.id}`);
          onClose();
        } else {
          // Fallback: navigate to dashboard
          navigate('/dashboard');
          onClose();
        }
      } else {
        // Multiple items: navigate to the first item (could be enhanced to show selection)
        const firstItem = order.items[0];
        if (firstItem.id) {
          navigate(`/sweet/${firstItem.id}`);
          onClose();
        } else {
          // Fallback: navigate to dashboard to browse all items
          navigate('/dashboard');
          onClose();
        }
      }
    } else {
      // No items: navigate to dashboard
      navigate('/dashboard');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 opacity-20 animate-pulse">
        <Package className="w-24 h-24 text-indigo-400" />
      </div>
      <div className="absolute bottom-10 left-10 opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}>
        <ShoppingBag className="w-20 h-20 text-purple-400" />
      </div>
      <div className="absolute top-1/2 left-10 opacity-10 animate-bounce" style={{ animationDelay: '0.2s' }}>
        <Truck className="w-16 h-16 text-pink-400" />
      </div>
      <div className="absolute bottom-1/3 right-1/4 opacity-15 animate-pulse" style={{ animationDelay: '1s' }}>
        <CheckCircle className="w-18 h-18 text-purple-300" />
      </div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all hover:scale-105 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-full p-3 shadow-lg">
                <Package className="w-8 h-8 text-purple-500" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Order History</h2>
                <p className="text-pink-100 mt-1">Track your sweet purchases</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setLoading(true);
                  // Trigger useEffect to reload orders
                  const event = new Event('storage');
                  window.dispatchEvent(event);
                  setTimeout(() => setLoading(false), 500);
                }}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                title="Refresh orders"
              >
                <Package className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-400 mb-2">No orders yet</h3>
              <p className="text-lg text-gray-500 mb-6">Start shopping to see your orders here</p>
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all font-semibold"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 border border-purple-100 shadow-md hover:shadow-lg transition-shadow">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">Order #{order.id}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(order.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>Delivery to {order.deliveryAddress.split(',')[0]}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-0 text-right">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </div>
                      <div className="text-lg font-bold text-gray-800 mt-1">₹{order.total.toFixed(2)}</div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Items Ordered:</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div 
                          key={index} 
                          className={`flex justify-between items-center text-sm p-2 rounded-lg transition-colors ${
                            item.id ? 'hover:bg-purple-100 cursor-pointer' : ''
                          }`}
                          onClick={() => {
                            if (item.id) {
                              navigate(`/sweet/${item.id}`);
                              onClose();
                            }
                          }}
                        >
                          <span className={item.id ? 'text-purple-700 hover:text-purple-900' : ''}>
                            {item.name} × {item.quantity}
                          </span>
                          <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tracking Steps */}
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">Order Tracking:</h4>
                    <div className="flex items-center justify-between">
                      {order.trackingSteps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                          }`}>
                            {step.completed ? '✓' : index + 1}
                          </div>
                          <div className="text-xs text-center mt-2">
                            <div className="font-semibold capitalize">{step.status}</div>
                            <div className="text-gray-500">{step.time}</div>
                          </div>
                          {index < order.trackingSteps.length - 1 && (
                            <div className={`absolute h-0.5 w-full mt-4 ${
                              step.completed && order.trackingSteps[index + 1].completed 
                                ? 'bg-green-500' 
                                : 'bg-gray-200'
                            }`} style={{ left: '50%', width: 'calc(100% - 2rem)' }} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6 pt-4 border-t border-purple-200">
                    <button className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all font-semibold">
                      Track Order
                    </button>
                    <button 
                      onClick={() => handleReorder(order)}
                      className="flex-1 border-2 border-purple-200 text-purple-700 py-3 rounded-lg hover:bg-purple-50 transition-colors font-semibold"
                    >
                      Reorder
                    </button>
                    {order.status === 'delivered' && (
                      <button className="flex-1 border-2 border-purple-200 text-purple-700 py-3 rounded-lg hover:bg-purple-50 transition-colors font-semibold">
                        Rate & Review
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;