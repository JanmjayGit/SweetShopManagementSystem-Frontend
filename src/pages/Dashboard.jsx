// import React, { useState, useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-hot-toast';
// import { 
//   Candy, 
//   ShoppingCart, 
//   Search, 
//   LogOut, 
//   User,
//   Plus,
//   Minus,
//   Trash2,
//   Filter,
//   X,
//   ShoppingBag,
//   Menu,
//   Shield
// } from 'lucide-react';
// import SweetCard from '../components/SweetCard';
// import Checkout from '../components/Checkout';
// import SearchAndFilter from '../components/SearchAndFilter';
// import OrderHistory from '../components/OrderHistory';
// import axiosInstance from '../api/axiosConfig';
// import { apiEndpoints } from '../api/apiEndpoints';
// import { AuthContext } from '../context/AuthContext';

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const { user, isAuthenticated, logout, loading: authLoading } = useContext(AuthContext);
//   const [sweets, setSweets] = useState([]);
//   const [filteredSweets, setFilteredSweets] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
//   const [sortBy, setSortBy] = useState('name');
//   const [showInStock, setShowInStock] = useState(false);
//   const [showCart, setShowCart] = useState(false);
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [showCheckout, setShowCheckout] = useState(false);
//   const [showOrderHistory, setShowOrderHistory] = useState(false);

//   useEffect(() => {
//     // Component only renders if authenticated (handled by ProtectedRoute)
//     fetchSweets();
//   }, []);

//   useEffect(() => {
//     filterAndSortSweets();
//   }, [searchQuery, selectedCategory, priceRange, sortBy, showInStock, sweets]);

//   const fetchSweets = async () => {
//     try {
//       const response = await axiosInstance.get(apiEndpoints.GET_ALL_SWEETS);
//       setSweets(response.data);
//       setFilteredSweets(response.data);
//     } catch (error) {
//       console.error('Error fetching sweets:', error);
//       toast.error('Failed to load sweets');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterAndSortSweets = () => {

//     if (!Array.isArray(sweets)) {
//       setFilteredSweets([]);
//       return;
//     }
//     let filtered = [...sweets];

//     // Category filter
//     if (selectedCategory !== 'All') {
//       filtered = filtered.filter(sweet => sweet.category === selectedCategory);
//     }

//     // Search filter
//     if (searchQuery) {
//       filtered = filtered.filter(sweet =>
//         sweet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         sweet.category?.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     // Price range filter
//     filtered = filtered.filter(sweet => 
//       sweet.price >= priceRange.min && sweet.price <= priceRange.max
//     );

//     // Stock filter
//     if (showInStock) {
//       filtered = filtered.filter(sweet => sweet.quantity > 0);
//     }

//     // Sorting
//     filtered.sort((a, b) => {
//       switch (sortBy) {
//         case 'name':
//           return a.name.localeCompare(b.name);
//         case 'name-desc':
//           return b.name.localeCompare(a.name);
//         case 'price':
//           return a.price - b.price;
//         case 'price-desc':
//           return b.price - a.price;
//         case 'rating':
//           return 4.8 - 4.5; // Placeholder since we don't have real ratings
//         case 'newest':
//           return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
//         default:
//           return 0;
//       }
//     });

//     setFilteredSweets(filtered);
//   };

//   const addToCart = (sweet) => {
//     if (sweet.quantity === 0) {
//       toast.error('This item is out of stock');
//       return;
//     }

//     const existingItem = cart.find(item => item.id === sweet.id);
    
//     if (existingItem) {
//       if (existingItem.cartQuantity >= sweet.quantity) {
//         toast.error('Cannot add more than available stock');
//         return;
//       }
//       setCart(cart.map(item =>
//         item.id === sweet.id
//           ? { ...item, cartQuantity: item.cartQuantity + 1 }
//           : item
//       ));
//       toast.success(`${sweet.name} quantity increased`);
//     } else {
//       setCart([...cart, { ...sweet, cartQuantity: 1 }]);
//       toast.success(`${sweet.name} added to cart`);
//     }
//   };

//   const removeFromCart = (sweetId) => {
//     setCart(cart.filter(item => item.id !== sweetId));
//     toast.success('Item removed from cart');
//   };

//   const updateCartQuantity = (sweetId, change) => {
//     setCart(cart.map(item => {
//       if (item.id === sweetId) {
//         const newQuantity = item.cartQuantity + change;
//         if (newQuantity <= 0) return item;
//         if (newQuantity > item.quantity) {
//           toast.error('Cannot exceed available stock');
//           return item;
//         }
//         return { ...item, cartQuantity: newQuantity };
//       }
//       return item;
//     }));
//   };

//   const handleProceedToCheckout = () => {
//     if (cart.length === 0) {
//       toast.error('Your cart is empty');
//       return;
//     }
//     setShowCart(false);
//     setShowCheckout(true);
//   };

//   const handleCheckoutSuccess = () => {
//     setCart([]);
//     setShowCheckout(false);
//     fetchSweets(); // Refresh the sweets list
//     toast.success('Thank you for your purchase!');
//   };

//   const handleLogout = () => {
//     logout();
//     toast.success('Logged out successfully');
//     navigate('/login');
//   };

//   const getTotalPrice = () => {
//     return cart.reduce((total, item) => total + (item.price * item.cartQuantity), 0);
//   };

//   const getTotalItems = () => {
//     return cart.reduce((total, item) => total + item.cartQuantity, 0);
//   };

//   // const categories = ['All', ...new Set(sweets.map(s => s.category))];
//   const categories = Array.isArray(sweets) && sweets.length > 0 
//   ? ['All', ...new Set(sweets.map(s => s.category))]
//   : ['All'];

//   // Show loading while fetching sweets
//   if (!user) {
//     return null; // This should never happen due to ProtectedRoute
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
//       {/* Navbar */}
//       <nav className="bg-white shadow-lg sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             {/* Logo */}
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => setShowSidebar(!showSidebar)}
//                 className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
//               >
//                 <Menu className="w-6 h-6" />
//               </button>
//               <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-2 rounded-lg">
//                 <Candy className="w-6 h-6 text-white" />
//               </div>
//               <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
//                 Sweet Shop
//               </span>
//             </div>

//             {/* Right Side */}
//             <div className="flex items-center gap-3">
//               {/* Order History Button */}
//               <button
//                 onClick={() => setShowOrderHistory(true)}
//                 className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <ShoppingBag className="w-5 h-5 text-gray-700" />
//                 <span className="hidden sm:inline text-sm font-semibold">Orders</span>
//               </button>

//               {/* Cart Button */}
//               <button
//                 onClick={() => setShowCart(true)}
//                 className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <ShoppingCart className="w-6 h-6 text-gray-700" />
//                 {cart.length > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
//                     {getTotalItems()}
//                   </span>
//                 )}
//               </button>

//               {/* Admin Panel Link */}
//               {user.role === 'ADMIN' && (
//                 <button
//                   onClick={() => navigate('/admin')}
//                   className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
//                 >
//                   <Shield className="w-4 h-4" />
//                   <span className="hidden sm:inline">Admin Panel</span>
//                 </button>
//               )}

//               {/* User Menu */}
//               <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
//                 <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-1 rounded-full">
//                   {user.role === 'ADMIN' ? (
//                     <Shield className="w-4 h-4 text-white" />
//                   ) : (
//                     <User className="w-4 h-4 text-white" />
//                   )}
//                 </div>
//                 <span className="text-sm font-semibold hidden sm:inline">{user.username}</span>
//               </div>

//               {/* Logout Button */}
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
//               >
//                 <LogOut className="w-4 h-4" />
//                 <span className="hidden sm:inline">Logout</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Welcome Section */}
//         <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl p-8 text-white mb-8 shadow-xl">
//           <h1 className="text-3xl md:text-4xl font-bold mb-2">
//             Welcome back, {user.username}! 👋
//           </h1>
//           <p className="text-pink-100">
//             {user.role === 'ADMIN' 
//               ? 'Manage your sweet shop inventory and orders' 
//               : 'Discover and order your favorite sweets'}
//           </p>
//         </div>

//         {/* Search and Filter */}
//         <SearchAndFilter
//           searchQuery={searchQuery}
//           onSearchChange={setSearchQuery}
//           categories={categories}
//           selectedCategory={selectedCategory}
//           onCategoryChange={setSelectedCategory}
//           priceRange={priceRange}
//           onPriceRangeChange={setPriceRange}
//           sortBy={sortBy}
//           onSortChange={setSortBy}
//           showInStock={showInStock}
//           onStockFilterChange={setShowInStock}
//         />

//         {/* Results Count */}
//         <div className="mb-6">
//           <p className="text-gray-600">
//             Showing <span className="font-bold text-purple-600">{filteredSweets.length}</span> sweets
//           </p>
//         </div>

//         {/* Loading */}
//         {loading ? (
//           <div className="flex justify-center items-center py-20">
//             <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
//           </div>
//         ) : (
//           <>
//             {/* Sweets Grid */}
//             {filteredSweets.length > 0 ? (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                 {filteredSweets.map((sweet) => {
//                   const cartItem = cart.find(item => item.id === sweet.id);
//                   return (
//                     <SweetCard
//                       key={sweet.id}
//                       sweet={sweet}
//                       onAddToCart={addToCart}
//                       isAuthenticated={true}
//                       showAddButton={true}
//                       cartQuantity={cartItem ? cartItem.cartQuantity : 0}
//                     />
//                   );
//                 })}
//               </div>
//             ) : (
//               <div className="text-center py-20">
//                 <Candy className="w-20 h-20 text-gray-300 mx-auto mb-4" />
//                 <h3 className="text-2xl font-bold text-gray-400 mb-2">No sweets found</h3>
//                 <p className="text-gray-500">Try adjusting your search or filters</p>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* Cart Modal - Centered like Login/Register */}
//       {showCart && (
//         <div className="fixed inset-0 z-50 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
//           {/* Decorative elements */}
//           <div className="absolute top-10 right-10 opacity-20 animate-pulse">
//             <Candy className="w-24 h-24 text-indigo-400" />
//           </div>
//           <div className="absolute bottom-10 left-10 opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}>
//             <Candy className="w-20 h-20 text-purple-400" />
//           </div>
//           <div className="absolute top-1/2 left-10 opacity-10 animate-bounce" style={{ animationDelay: '0.2s' }}>
//             <Candy className="w-16 h-16 text-pink-400" />
//           </div>
//           <div className="absolute bottom-1/3 right-1/4 opacity-15 animate-pulse" style={{ animationDelay: '1s' }}>
//             <ShoppingBag className="w-18 h-18 text-purple-300" />
//           </div>

//           {/* Cart Panel */}
//           <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all hover:scale-105 duration-300">
//             {/* Header */}
//             <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-6 text-white">
//               <div className="flex justify-between items-center">
//                 <div className="flex items-center gap-3">
//                   <div className="bg-white rounded-full p-3 shadow-lg">
//                     <ShoppingBag className="w-8 h-8 text-purple-500" />
//                   </div>
//                   <div>
//                     <h2 className="text-3xl font-bold">Your Cart</h2>
//                     <p className="text-pink-100 mt-1">{getTotalItems()} delicious items</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setShowCart(false)}
//                   className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>
//             </div>

//             {/* Cart Items */}
//             <div className="flex-1 overflow-y-auto p-6" style={{ maxHeight: '60vh' }}>
//               {cart.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-64 text-gray-400">
//                   <ShoppingCart className="w-24 h-24 mb-6 text-gray-300" />
//                   <h3 className="text-2xl font-bold text-gray-400 mb-2">Your cart is empty</h3>
//                   <p className="text-lg text-gray-500 mb-6">Add some sweet treats to get started!</p>
//                   <button
//                     onClick={() => setShowCart(false)}
//                     className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all font-semibold"
//                   >
//                     Continue Shopping
//                   </button>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {cart.map((item) => (
//                     <div key={item.id} className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 shadow-md border border-purple-100 hover:shadow-lg transition-shadow">
//                       <div className="flex gap-4">
//                         <div className="w-24 h-24 bg-gradient-to-br from-pink-200 to-purple-200 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
//                           {item.imageUrl ? (
//                             <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-xl" />
//                           ) : (
//                             <Candy className="w-12 h-12 text-purple-400" />
//                           )}
//                         </div>

//                         <div className="flex-1">
//                           <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
//                           <p className="text-sm text-purple-600 font-semibold">{item.category}</p>
//                           <p className="text-purple-700 font-bold mt-1 text-lg">₹{item.price}</p>

//                           <div className="flex items-center justify-between mt-4">
//                             <div className="flex items-center gap-3 bg-white rounded-xl border-2 border-purple-200 shadow-sm">
//                               <button
//                                 onClick={() => updateCartQuantity(item.id, -1)}
//                                 className="p-2 hover:bg-purple-50 rounded-l-xl transition-colors"
//                               >
//                                 <Minus className="w-4 h-4 text-purple-600" />
//                               </button>
//                               <span className="font-bold px-4 text-lg text-purple-700">{item.cartQuantity}</span>
//                               <button
//                                 onClick={() => updateCartQuantity(item.id, 1)}
//                                 className="p-2 hover:bg-purple-50 rounded-r-xl transition-colors"
//                               >
//                                 <Plus className="w-4 h-4 text-purple-600" />
//                               </button>
//                             </div>

//                             <button
//                               onClick={() => removeFromCart(item.id)}
//                               className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors shadow-sm"
//                             >
//                               <Trash2 className="w-5 h-5" />
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Footer */}
//             {cart.length > 0 && (
//               <div className="border-t-2 border-purple-100 p-6 bg-gradient-to-r from-pink-50 to-purple-50">
//                 <div className="flex justify-between items-center mb-6">
//                   <span className="text-xl font-bold text-gray-700">Total Amount:</span>
//                   <span className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
//                     ₹{getTotalPrice().toFixed(2)}
//                   </span>
//                 </div>
//                 <div className="flex gap-3">
//                   <button
//                     onClick={() => setShowCart(false)}
//                     className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-300 transition-colors"
//                   >
//                     Continue Shopping
//                   </button>
//                   <button
//                     onClick={handleProceedToCheckout}
//                     className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
//                   >
//                     Proceed to Checkout
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Checkout Modal */}
//       {showCheckout && (
//         <Checkout
//           cart={cart}
//           totalAmount={getTotalPrice()}
//           onClose={() => setShowCheckout(false)}
//           onSuccess={handleCheckoutSuccess}
//         />
//       )}

//       {/* Order History Modal */}
//       <OrderHistory
//         isOpen={showOrderHistory}
//         onClose={() => setShowOrderHistory(false)}
//       />
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  Candy, 
  ShoppingCart, 
  Search, 
  LogOut, 
  User,
  Plus,
  Minus,
  Trash2,
  Filter,
  X,
  ShoppingBag,
  Menu,
  Shield
} from 'lucide-react';
import SweetCard from '../components/SweetCard';
import Checkout from '../components/Checkout';
import SearchAndFilter from '../components/SearchAndFilter';
import OrderHistory from '../components/OrderHistory';
import axiosInstance from '../api/axiosConfig';
import { apiEndpoints } from '../api/apiEndpoints';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, loading: authLoading } = useContext(AuthContext);
  const [sweets, setSweets] = useState([]);
  const [filteredSweets, setFilteredSweets] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState('name');
  const [showInStock, setShowInStock] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);

  useEffect(() => {
    // Component only renders if authenticated (handled by ProtectedRoute)
    fetchSweets();
  }, []);

  useEffect(() => {
    filterAndSortSweets();
  }, [searchQuery, selectedCategory, priceRange, sortBy, showInStock, sweets]);

  const fetchSweets = async () => {
    try {
      const response = await axiosInstance.get(apiEndpoints.GET_ALL_SWEETS);
      
      // Ensure response.data is an array
      const data = Array.isArray(response.data) ? response.data : [];
      
      setSweets(data);
      setFilteredSweets(data);
    } catch (error) {
      console.error('Error fetching sweets:', error);
      toast.error('Failed to load sweets');
      // Set empty arrays on error
      setSweets([]);
      setFilteredSweets([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortSweets = () => {
    // Safety check - ensure sweets is an array
    if (!Array.isArray(sweets)) {
      setFilteredSweets([]);
      return;
    }

    let filtered = [...sweets];

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(sweet => sweet.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(sweet =>
        sweet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sweet.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price range filter
    filtered = filtered.filter(sweet => 
      sweet.price >= priceRange.min && sweet.price <= priceRange.max
    );

    // Stock filter
    if (showInStock) {
      filtered = filtered.filter(sweet => sweet.quantity > 0);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return 4.8 - 4.5; // Placeholder since we don't have real ratings
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return 0;
      }
    });

    setFilteredSweets(filtered);
  };

  const addToCart = (sweet) => {
    if (sweet.quantity === 0) {
      toast.error('This item is out of stock');
      return;
    }

    const existingItem = cart.find(item => item.id === sweet.id);
    
    if (existingItem) {
      if (existingItem.cartQuantity >= sweet.quantity) {
        toast.error('Cannot add more than available stock');
        return;
      }
      setCart(cart.map(item =>
        item.id === sweet.id
          ? { ...item, cartQuantity: item.cartQuantity + 1 }
          : item
      ));
      toast.success(`${sweet.name} quantity increased`);
    } else {
      setCart([...cart, { ...sweet, cartQuantity: 1 }]);
      toast.success(`${sweet.name} added to cart`);
    }
  };

  const removeFromCart = (sweetId) => {
    setCart(cart.filter(item => item.id !== sweetId));
    toast.success('Item removed from cart');
  };

  const updateCartQuantity = (sweetId, change) => {
    setCart(cart.map(item => {
      if (item.id === sweetId) {
        const newQuantity = item.cartQuantity + change;
        if (newQuantity <= 0) return item;
        if (newQuantity > item.quantity) {
          toast.error('Cannot exceed available stock');
          return item;
        }
        return { ...item, cartQuantity: newQuantity };
      }
      return item;
    }));
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    setShowCart(false);
    setShowCheckout(true);
  };

  const handleCheckoutSuccess = () => {
    setCart([]);
    setShowCheckout(false);
    fetchSweets(); // Refresh the sweets list
    toast.success('Thank you for your purchase!');
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.cartQuantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.cartQuantity, 0);
  };

  // Safety check for categories
  const categories = Array.isArray(sweets) && sweets.length > 0 
    ? ['All', ...new Set(sweets.map(s => s.category))]
    : ['All'];

  // Show loading while fetching sweets
  if (!user) {
    return null; // This should never happen due to ProtectedRoute
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Navbar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-2 rounded-lg">
                <Candy className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                Sweet Shop
              </span>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Order History Button */}
              <button
                onClick={() => setShowOrderHistory(true)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ShoppingBag className="w-5 h-5 text-gray-700" />
                <span className="hidden sm:inline text-sm font-semibold">Orders</span>
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setShowCart(true)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              {/* Admin Panel Link */}
              {user.role === 'ADMIN' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                >
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin Panel</span>
                </button>
              )}

              {/* User Menu */}
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-1 rounded-full">
                  {user.role === 'ADMIN' ? (
                    <Shield className="w-4 h-4 text-white" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className="text-sm font-semibold hidden sm:inline">{user.username}</span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl p-8 text-white mb-8 shadow-xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {user.username}! 👋
          </h1>
          <p className="text-pink-100">
            {user.role === 'ADMIN' 
              ? 'Manage your sweet shop inventory and orders' 
              : 'Discover and order your favorite sweets'}
          </p>
        </div>

        {/* Search and Filter */}
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          sortBy={sortBy}
          onSortChange={setSortBy}
          showInStock={showInStock}
          onStockFilterChange={setShowInStock}
        />

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-bold text-purple-600">{Array.isArray(filteredSweets) ? filteredSweets.length : 0}</span> sweets
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Sweets Grid */}
            {Array.isArray(filteredSweets) && filteredSweets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredSweets.map((sweet) => {
                  const cartItem = cart.find(item => item.id === sweet.id);
                  return (
                    <SweetCard
                      key={sweet.id}
                      sweet={sweet}
                      onAddToCart={addToCart}
                      isAuthenticated={true}
                      showAddButton={true}
                      cartQuantity={cartItem ? cartItem.cartQuantity : 0}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <Candy className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-400 mb-2">No sweets found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Cart Modal - Centered like Login/Register */}
      {showCart && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
          {/* Decorative elements */}
          <div className="absolute top-10 right-10 opacity-20 animate-pulse">
            <Candy className="w-24 h-24 text-indigo-400" />
          </div>
          <div className="absolute bottom-10 left-10 opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}>
            <Candy className="w-20 h-20 text-purple-400" />
          </div>
          <div className="absolute top-1/2 left-10 opacity-10 animate-bounce" style={{ animationDelay: '0.2s' }}>
            <Candy className="w-16 h-16 text-pink-400" />
          </div>
          <div className="absolute bottom-1/3 right-1/4 opacity-15 animate-pulse" style={{ animationDelay: '1s' }}>
            <ShoppingBag className="w-18 h-18 text-purple-300" />
          </div>

          {/* Cart Panel */}
          <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all hover:scale-105 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-6 text-white">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-white rounded-full p-3 shadow-lg">
                    <ShoppingBag className="w-8 h-8 text-purple-500" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Your Cart</h2>
                    <p className="text-pink-100 mt-1">{getTotalItems()} delicious items</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6" style={{ maxHeight: '60vh' }}>
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <ShoppingCart className="w-24 h-24 mb-6 text-gray-300" />
                  <h3 className="text-2xl font-bold text-gray-400 mb-2">Your cart is empty</h3>
                  <p className="text-lg text-gray-500 mb-6">Add some sweet treats to get started!</p>
                  <button
                    onClick={() => setShowCart(false)}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all font-semibold"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 shadow-md border border-purple-100 hover:shadow-lg transition-shadow">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 bg-gradient-to-br from-pink-200 to-purple-200 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <Candy className="w-12 h-12 text-purple-400" />
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
                          <p className="text-sm text-purple-600 font-semibold">{item.category}</p>
                          <p className="text-purple-700 font-bold mt-1 text-lg">₹{item.price}</p>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-3 bg-white rounded-xl border-2 border-purple-200 shadow-sm">
                              <button
                                onClick={() => updateCartQuantity(item.id, -1)}
                                className="p-2 hover:bg-purple-50 rounded-l-xl transition-colors"
                              >
                                <Minus className="w-4 h-4 text-purple-600" />
                              </button>
                              <span className="font-bold px-4 text-lg text-purple-700">{item.cartQuantity}</span>
                              <button
                                onClick={() => updateCartQuantity(item.id, 1)}
                                className="p-2 hover:bg-purple-50 rounded-r-xl transition-colors"
                              >
                                <Plus className="w-4 h-4 text-purple-600" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors shadow-sm"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t-2 border-purple-100 p-6 bg-gradient-to-r from-pink-50 to-purple-50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-bold text-gray-700">Total Amount:</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    ₹{getTotalPrice().toFixed(2)}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCart(false)}
                    className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={handleProceedToCheckout}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <Checkout
          cart={cart}
          totalAmount={getTotalPrice()}
          onClose={() => setShowCheckout(false)}
          onSuccess={handleCheckoutSuccess}
        />
      )}

      {/* Order History Modal */}
      <OrderHistory
        isOpen={showOrderHistory}
        onClose={() => setShowOrderHistory(false)}
      />
    </div>
  );
};

export default Dashboard;