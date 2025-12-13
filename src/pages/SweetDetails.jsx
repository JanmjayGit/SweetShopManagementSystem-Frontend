import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Plus, Minus, ShoppingCart, Heart, Candy, Award, Clock, Truck, Share2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../api/axiosConfig';
import { apiEndpoints } from '../api/apiEndpoints';

const SweetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [sweet, setSweet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedFlavor, setSelectedFlavor] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchSweet();
    loadCart();
  }, [id]);

  const enhanceSweet = (sweet) => {
    if (!sweet) return sweet;
    
    // Only enhance missing fields, preserve existing data from admin panel
    const categoryDefaults = {
      'Chocolate': {
        flavors: ['Dark Chocolate', 'Milk Chocolate', 'White Chocolate', 'Hazelnut'],
        ingredients: ['Cocoa', 'Sugar', 'Milk', 'Butter', 'Vanilla'],
        allergens: ['Milk', 'Nuts', 'Soy']
      },
      'Cake': {
        flavors: ['Vanilla', 'Chocolate', 'Strawberry', 'Red Velvet', 'Butterscotch'],
        ingredients: ['Flour', 'Sugar', 'Eggs', 'Butter', 'Milk', 'Baking Powder'],
        allergens: ['Gluten', 'Eggs', 'Milk']
      },
      'Candy': {
        flavors: ['Strawberry', 'Orange', 'Lemon', 'Cherry', 'Apple'],
        ingredients: ['Sugar', 'Glucose Syrup', 'Natural Flavors', 'Food Coloring'],
        allergens: ['Artificial Colors']
      },
      'Cookies': {
        flavors: ['Chocolate Chip', 'Oatmeal', 'Sugar Cookie', 'Peanut Butter'],
        ingredients: ['Flour', 'Sugar', 'Butter', 'Eggs', 'Chocolate Chips'],
        allergens: ['Gluten', 'Eggs', 'Milk', 'Nuts']
      },
      'Sweets': {
        flavors: ['Traditional', 'Kesar', 'Rose', 'Pistachio'],
        ingredients: ['Milk', 'Sugar', 'Ghee', 'Cardamom', 'Nuts'],
        allergens: ['Milk', 'Nuts']
      }
    };

    const defaults = categoryDefaults[sweet.category] || categoryDefaults['Sweets'];
    
    return {
      ...sweet,
      // Only add default flavors if none exist
      flavors: (sweet.flavors && sweet.flavors.length > 0) ? sweet.flavors : defaults.flavors,
      // Only add default ingredients if none exist
      ingredients: (sweet.ingredients && sweet.ingredients.length > 0) ? sweet.ingredients : defaults.ingredients,
      // Keep original description if it exists, don't override with generic one
      description: sweet.description || `Delicious ${sweet.name} made with premium ingredients. A perfect treat for any occasion.`,
      // Only add default allergens if none exist
      allergens: (sweet.allergens && sweet.allergens.length > 0) ? sweet.allergens : defaults.allergens,
      // Only add nutritional info if missing
      nutritionalInfo: (sweet.nutritionalInfo && Object.keys(sweet.nutritionalInfo).length > 0) ? sweet.nutritionalInfo : {
        calories: '200 kcal',
        protein: '4g',
        carbs: '30g',
        fat: '8g',
        sugar: '25g'
      },
      // Only add defaults for missing fields
      weight: sweet.weight || '100g',
      shelfLife: sweet.shelfLife || '5-7 days',
      rating: sweet.rating || 4.5,
      reviews: sweet.reviews || Math.floor(Math.random() * 200) + 50
    };
  };

  const generateSampleSweet = (sweetId) => {
    // Generate sample sweet based on ID
    const sampleNames = [
      'Chocolate Truffle', 'Vanilla Cake', 'Strawberry Candy', 'Chocolate Chip Cookie', 'Rasmalai',
      'Gulab Jamun', 'Rasgulla', 'Kaju Katli', 'Laddu', 'Barfi',
      'Red Velvet Cake', 'Fruit Cake', 'Cheesecake', 'Brownie', 'Cupcake',
      'Gummy Bears', 'Lollipop', 'Chocolate Bar', 'Caramel', 'Toffee'
    ];
    
    const categories = ['Chocolate', 'Cake', 'Candy', 'Cookies', 'Sweets'];
    const prices = [25, 30, 35, 40, 45, 50, 55, 60, 65, 70];
    
    const index = parseInt(sweetId) % sampleNames.length;
    const categoryIndex = parseInt(sweetId) % categories.length;
    const priceIndex = parseInt(sweetId) % prices.length;
    
    return {
      id: sweetId,
      name: sampleNames[index],
      category: categories[categoryIndex],
      price: prices[priceIndex],
      quantity: Math.floor(Math.random() * 100) + 10,
      imageUrl: null // Will be enhanced by enhanceSweet function
    };
  };

  const fetchSweet = async () => {
    try {
      // Try to fetch from API first - this should have the real data from admin panel
      const response = await axiosInstance.get(apiEndpoints.GET_ALL_SWEETS);
      const sweets = response.data;
      
      // Look for the sweet by ID (try both string and number comparison)
      let foundSweet = sweets.find(s => 
        s.id.toString() === id.toString() || 
        s.id === parseInt(id) || 
        s.id === id
      );
      
      if (foundSweet) {
        // Found the real sweet data from API - use it as is, only enhance missing fields
        const enhancedSweet = enhanceSweet(foundSweet);
        setSweet(enhancedSweet);
        return;
      }
      
      // If not found in API, try localStorage
      const storedSweets = JSON.parse(localStorage.getItem('sweets') || '[]');
      foundSweet = storedSweets.find(s => 
        s.id.toString() === id.toString() || 
        s.id === parseInt(id) || 
        s.id === id
      );
      
      if (foundSweet) {
        // Found in localStorage - use it
        const enhancedSweet = enhanceSweet(foundSweet);
        setSweet(enhancedSweet);
        return;
      }
      
      // Only generate sample data if absolutely nothing is found
      console.warn(`Sweet with ID ${id} not found in API or localStorage, generating sample data`);
      const sampleSweet = generateSampleSweet(id);
      const enhancedSweet = enhanceSweet(sampleSweet);
      setSweet(enhancedSweet);
      
    } catch (error) {
      console.error('Error fetching sweet from API:', error);
      
      // Try localStorage as fallback
      const storedSweets = JSON.parse(localStorage.getItem('sweets') || '[]');
      let foundSweet = storedSweets.find(s => 
        s.id.toString() === id.toString() || 
        s.id === parseInt(id) || 
        s.id === id
      );
      
      if (foundSweet) {
        const enhancedSweet = enhanceSweet(foundSweet);
        setSweet(enhancedSweet);
      } else {
        // Generate sample data as absolute last resort
        console.warn(`API failed and sweet ${id} not in localStorage, generating sample data`);
        const sampleSweet = generateSampleSweet(id);
        const enhancedSweet = enhanceSweet(sampleSweet);
        setSweet(enhancedSweet);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  };

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (sweet.quantity === 0) {
      toast.error('This item is out of stock');
      return;
    }

    const existingItem = cart.find(item => item.id === sweet.id);
    
    if (existingItem) {
      if (existingItem.cartQuantity + quantity > sweet.quantity) {
        toast.error('Cannot add more than available stock');
        return;
      }
      const newCart = cart.map(item =>
        item.id === sweet.id
          ? { ...item, cartQuantity: item.cartQuantity + quantity }
          : item
      );
      saveCart(newCart);
      toast.success(`${sweet.name} quantity increased by ${quantity}`);
    } else {
      const newCart = [...cart, { ...sweet, cartQuantity: quantity }];
      saveCart(newCart);
      toast.success(`Added ${quantity} ${sweet.name} to cart!`);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: sweet.name,
        text: `Check out this delicious ${sweet.name} from Sweet Shop!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!sweet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <Candy className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-400 mb-2">Sweet not found</h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isOutOfStock = sweet.quantity === 0;
  const isLowStock = sweet.quantity > 0 && sweet.quantity < 10;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-lg sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-gray-800 truncate mx-4">{sweet.name}</h1>
          <button
            onClick={handleShare}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Share2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        {/* Desktop Back Button */}
        <div className="hidden lg:block mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Sweets</span>
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Section */}
          <div className="flex justify-center">
            <div className="w-full max-w-md aspect-square bg-white rounded-2xl shadow-2xl overflow-hidden">
              {sweet.imageUrl ? (
                <img
                  src={sweet.imageUrl}
                  alt={sweet.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              
              {/* Fallback display when no image */}
              <div 
                className="w-full h-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center"
                style={{ display: sweet.imageUrl ? 'none' : 'flex' }}
              >
                <div className="text-center">
                  <Candy className="w-24 h-24 text-purple-400 mx-auto mb-4" />
                  <p className="text-purple-600 font-semibold text-lg">{sweet.name}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Title and Rating */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">{sweet.name}</h1>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-3 hover:bg-white hover:bg-opacity-50 rounded-full transition-colors"
                >
                  <Heart className={`w-6 h-6 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                </button>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-gray-600 ml-2">({sweet.rating || 4.8}) • {sweet.reviews || 124} reviews</span>
                </div>
              </div>
              
              <span className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm font-semibold px-4 py-2 rounded-full border border-purple-200">
                {sweet.category}
              </span>
            </div>

            {/* Price */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-4">
                <span className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  ₹{sweet.price.toFixed(2)}
                </span>
                <span className="text-gray-500">/piece</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">Inclusive of all taxes</p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {isOutOfStock ? (
                <span className="bg-red-100 text-red-600 text-sm font-semibold px-4 py-2 rounded-full">
                  Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="bg-orange-100 text-orange-600 text-sm font-semibold px-4 py-2 rounded-full">
                  Only {sweet.quantity} left in stock
                </span>
              ) : (
                <span className="bg-green-100 text-green-600 text-sm font-semibold px-4 py-2 rounded-full">
                  In Stock ({sweet.quantity} available)
                </span>
              )}
            </div>

            {/* Available Flavors */}
            {sweet.flavors && sweet.flavors.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Candy className="w-5 h-5 text-pink-500" />
                  Available Flavors
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {sweet.flavors.map((flavor, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedFlavor(index)}
                      className={`p-3 rounded-lg text-sm font-semibold transition-all ${
                        selectedFlavor === index
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {flavor}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-800">Quantity:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 bg-purple-100 text-purple-700 font-bold rounded-lg min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(sweet.quantity, quantity + 1))}
                    disabled={isOutOfStock || quantity >= sweet.quantity}
                    className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-4 rounded-xl hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-6 h-6" />
                <span>{isOutOfStock ? 'Out of Stock' : `Add ${quantity} to Cart`}</span>
              </button>
              
              {isAuthenticated && cart.length > 0 && (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full flex items-center justify-center gap-3 border-2 border-purple-500 text-purple-600 font-bold py-4 rounded-xl hover:bg-purple-50 transition-colors mt-3"
                >
                  <ShoppingCart className="w-6 h-6" />
                  <span>Go to Cart ({cart.reduce((sum, item) => sum + item.cartQuantity, 0)} items)</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information Sections */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Description */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-purple-500" />
              Description
            </h3>
            <p className="text-gray-600 leading-relaxed">{sweet.description}</p>
          </div>

          {/* Product Information */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-xl text-gray-800 mb-4">Product Information</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-600">Delivery:</span>
                </div>
                <span className="font-semibold text-blue-700">Same day in most areas</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">Shelf Life:</span>
                </div>
                <span className="font-semibold text-green-700">{sweet.shelfLife || '5-7 days'}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-500" />
                  <span className="text-gray-600">Weight:</span>
                </div>
                <span className="font-semibold text-purple-700">{sweet.weight || '100g'}</span>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          {sweet.ingredients && sweet.ingredients.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-xl text-gray-800 mb-4">Ingredients</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600">{sweet.ingredients.join(', ')}</p>
              </div>
            </div>
          )}

          {/* Nutritional Information */}
          {sweet.nutritionalInfo && Object.keys(sweet.nutritionalInfo).length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-xl text-gray-800 mb-4">Nutritional Information</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(sweet.nutritionalInfo).map(([key, value]) => (
                  <div key={key} className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3 border border-green-200">
                    <div className="text-sm text-gray-600 capitalize">{key}</div>
                    <div className="font-bold text-green-700">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Allergen Information */}
        {sweet.allergens && sweet.allergens.length > 0 && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
            <h3 className="font-bold text-xl text-gray-800 mb-3">Allergen Information</h3>
            <p className="text-yellow-800">
              <strong>Contains:</strong> {sweet.allergens.join(', ')}
            </p>
            <p className="text-sm text-yellow-600 mt-2">
              Please check ingredients if you have specific allergies
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SweetDetails;