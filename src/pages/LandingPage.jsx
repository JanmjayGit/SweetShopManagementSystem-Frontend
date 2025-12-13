import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  Candy, 
  Search, 
  LogIn, 
  UserPlus,
  Sparkles,
  Filter,
  X
} from 'lucide-react';
import SweetCard from '../components/SweetCard';
import Footer from '../components/Footer';
import { apiEndpoints } from '../api/apiEndpoints';
import axios from 'axios';

const LandingPage = () => {
  const navigate = useNavigate();
  const [sweets, setSweets] = useState([]);
  const [filteredSweets, setFilteredSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Fetch sweets on component mount
  useEffect(() => {
    fetchSweets();
  }, []);

  // Filter sweets when search or category changes
  useEffect(() => {
    filterSweets();
  }, [searchQuery, selectedCategory, sweets]);

  const fetchSweets = async () => {
    try {
      setLoading(true);
      
      // Try to fetch real sweets data from backend
      const response = await axios.get(apiEndpoints.GET_ALL_SWEETS);
      
      if (response.data && response.data.length > 0) {
        setSweets(response.data);
        setFilteredSweets(response.data);
      } else {
        // If no sweets in backend, show sample data
        showSampleData();
      }
    } catch (error) {
      console.log('Backend not available or requires auth, showing sample data');
      // If backend is not available or requires authentication, show sample data
      showSampleData();
    } finally {
      setLoading(false);
    }
  };

  const showSampleData = () => {
    const sampleSweets = [
      {
        id: 'sample-1',
        name: 'Chocolate Truffle',
        category: 'Chocolate',
        price: 25.99,
        quantity: 15,
        description: 'Rich dark chocolate truffle with cocoa powder',
        imageUrl: null
      },
      {
        id: 'sample-2',
        name: 'Strawberry Delight',
        category: 'Fruit',
        price: 18.50,
        quantity: 8,
        description: 'Fresh strawberry flavored sweet treat',
        imageUrl: null
      },
      {
        id: 'sample-3',
        name: 'Vanilla Cream Cake',
        category: 'Cake',
        price: 45.00,
        quantity: 0,
        description: 'Soft vanilla sponge cake with cream',
        imageUrl: null
      },
      {
        id: 'sample-4',
        name: 'Caramel Fudge',
        category: 'Caramel',
        price: 22.75,
        quantity: 12,
        description: 'Smooth caramel fudge with butter',
        imageUrl: null
      },
      {
        id: 'sample-5',
        name: 'Mint Chocolate Chip',
        category: 'Chocolate',
        price: 28.00,
        quantity: 20,
        description: 'Refreshing mint with chocolate chips',
        imageUrl: null
      },
      {
        id: 'sample-6',
        name: 'Lemon Tart',
        category: 'Tart',
        price: 16.25,
        quantity: 6,
        description: 'Tangy lemon tart with crispy crust',
        imageUrl: null
      }
    ];
    
    setSweets(sampleSweets);
    setFilteredSweets(sampleSweets);
  };

  const filterSweets = () => {
    let filtered = sweets;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(sweet => sweet.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(sweet =>
        sweet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sweet.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredSweets(filtered);
  };

  const handleOrderClick = () => {
    toast.error('Please login or create an account to place an order', {
      icon: '🔒',
    });
    navigate('/login');
  };

  const categories = ['All', ...new Set(sweets.map(s => s.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Navbar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-2 rounded-lg">
                <Candy className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                Sweet Shop
              </span>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Up</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Sparkles className="w-16 h-16 animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Indulge in Sweet Delights
          </h1>
          <p className="text-xl md:text-2xl text-pink-100 mb-8">
            Discover our handcrafted collection of premium sweets and treats
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => document.getElementById('sweets-section').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 bg-white text-purple-600 rounded-lg font-bold hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              Explore Collection
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div id="sweets-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for sweets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-purple-500 transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span>Filter</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={fetchSweets}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all"
            title="Refresh sweets from backend"
          >
            <Sparkles className="w-5 h-5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* Category Filter Menu */}
        {showFilterMenu && (
          <div className="bg-white rounded-lg shadow-lg p-4 mb-8 border-2 border-purple-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Categories</h3>
              <button onClick={() => setShowFilterMenu(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stats and Login Notice */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-gray-600">
              Showing <span className="font-bold text-purple-600">{filteredSweets.length}</span> delicious treats
              {sweets.length > 0 && typeof sweets[0].id === 'string' && sweets[0].id.startsWith('sample-') && (
                <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                  Sample Data
                </span>
              )}
            </p>
            <div className="bg-gradient-to-r from-pink-100 to-purple-100 border border-purple-200 rounded-lg p-3">
              <p className="text-sm text-purple-700 font-semibold">
                🔒 <Link to="/login" className="underline hover:text-purple-800">Login</Link> to place orders and access full features!
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Sweets Grid */}
            {filteredSweets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredSweets.map((sweet) => (
                  <SweetCard
                    key={sweet.id}
                    sweet={sweet}
                    onAddToCart={handleOrderClick}
                    isAuthenticated={false}
                    showAddButton={true}
                  />
                ))}
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;