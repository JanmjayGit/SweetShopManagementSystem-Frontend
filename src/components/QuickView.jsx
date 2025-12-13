import { X, Star, Plus, Minus, ShoppingCart, Heart, Candy, Award, Clock, Truck } from 'lucide-react';

const QuickView = ({ sweet, isOpen, onClose, onAddToCart, cartQuantity = 0 }) => {
  if (!isOpen || !sweet) return null;

  const {
    name,
    category,
    price,
    quantity,
    imageUrl,
    description = "Delicious handcrafted sweet made with premium ingredients. Perfect for celebrations, gifts, or treating yourself to something special.",
    flavors = [],
    ingredients = [],
    nutritionalInfo = {},
    allergens = [],
    weight = "100g",
    shelfLife = "5-7 days"
  } = sweet;

  // Generate sample data if not provided
  const sampleFlavors = flavors.length > 0 ? flavors : 
    category === 'Chocolate' ? ['Dark Chocolate', 'Milk Chocolate', 'White Chocolate'] :
    category === 'Cake' ? ['Vanilla', 'Chocolate', 'Strawberry', 'Red Velvet'] :
    category === 'Candy' ? ['Strawberry', 'Orange', 'Lemon', 'Cherry'] :
    category === 'Cookies' ? ['Chocolate Chip', 'Oatmeal', 'Sugar Cookie'] :
    ['Original', 'Premium', 'Special'];

  const sampleNutrition = Object.keys(nutritionalInfo).length > 0 ? nutritionalInfo : {
    calories: '250 kcal',
    protein: '4g',
    carbs: '35g',
    fat: '12g',
    sugar: '28g'
  };

  const isOutOfStock = quantity === 0;
  const isLowStock = quantity > 0 && quantity < 10;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-4 overflow-hidden">
      {/* Decorative elements - Static to prevent shaking */}
      <div className="absolute top-10 right-10 opacity-20">
        <Candy className="w-24 h-24 text-indigo-400" />
      </div>
      <div className="absolute bottom-10 left-10 opacity-20">
        <Star className="w-20 h-20 text-purple-400" />
      </div>
      <div className="absolute top-1/2 left-10 opacity-10">
        <Heart className="w-16 h-16 text-pink-400" />
      </div>
      <div className="absolute bottom-1/3 right-1/4 opacity-15">
        <Award className="w-18 h-18 text-purple-300" />
      </div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl h-[95vh] sm:h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-full p-3 shadow-lg">
                <Candy className="w-8 h-8 text-purple-500" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Sweet Details</h2>
                <p className="text-pink-100 mt-1">Everything you need to know</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors touch-manipulation"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Image Section */}
          <div className="flex justify-center mb-6">
            <div className="w-48 h-48 sm:w-56 sm:h-56 bg-gradient-to-br from-pink-200 to-purple-200 rounded-2xl overflow-hidden shadow-lg">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Candy className="w-16 h-16 text-purple-400" />
                </div>
              )}
            </div>
          </div>

          {/* Product Name */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{name}</h1>
            <div className="flex items-center justify-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
              <span className="text-gray-600 ml-2">(4.8) • 124 reviews</span>
            </div>
            <span className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm font-semibold px-4 py-2 rounded-full border border-purple-200">
              {category}
            </span>
          </div>
          {/* Price Section */}
          <div className="text-center mb-6">
            <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
              ₹{price.toFixed(2)}
            </div>
            <p className="text-gray-600">Inclusive of all taxes</p>
          </div>

          {/* Stock Status */}
          <div className="flex justify-center mb-6">
            {isOutOfStock ? (
              <span className="bg-red-100 text-red-600 text-sm font-semibold px-6 py-3 rounded-full">
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="bg-orange-100 text-orange-600 text-sm font-semibold px-6 py-3 rounded-full">
                Only {quantity} left
              </span>
            ) : (
              <span className="bg-green-100 text-green-600 text-sm font-semibold px-6 py-3 rounded-full">
                In Stock ({quantity})
              </span>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3 text-center">Description</h3>
            <p className="text-gray-600 leading-relaxed text-center text-sm">{description}</p>
          </div>

          {/* Available Flavors */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3 text-center">Available Flavors</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {sampleFlavors.map((flavor, index) => (
                <span 
                  key={index}
                  className="bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 px-3 py-2 rounded-full text-sm font-semibold border border-purple-200"
                >
                  {flavor}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3 text-center border border-green-200">
              <div className="text-xs text-gray-600">Calories</div>
              <div className="font-bold text-green-700">{sampleNutrition.calories}</div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 text-center border border-blue-200">
              <div className="text-xs text-gray-600">Weight</div>
              <div className="font-bold text-blue-700">{weight}</div>
            </div>
          </div>

          {/* Add to Cart Section */}
          <div className="space-y-4">
            {cartQuantity > 0 ? (
              <div className="flex items-center justify-center gap-4 bg-purple-100 rounded-xl p-4">
                <button className="bg-white rounded-full p-3 hover:bg-gray-50 shadow-md transition-colors">
                  <Minus className="w-5 h-5" />
                </button>
                <span className="px-6 py-2 bg-white rounded-lg font-bold text-purple-600 text-xl min-w-[4rem] text-center">
                  {cartQuantity}
                </span>
                <button 
                  onClick={() => onAddToCart(sweet)}
                  disabled={isOutOfStock}
                  className="bg-white rounded-full p-3 hover:bg-gray-50 disabled:opacity-50 shadow-md transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onAddToCart(sweet)}
                disabled={isOutOfStock}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-4 rounded-xl hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed text-lg touch-manipulation"
              >
                <ShoppingCart className="w-6 h-6" />
                <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
              </button>
            )}
            
            {/* Wishlist Button */}
            <button className="w-full flex items-center justify-center gap-2 border-2 border-pink-200 text-pink-600 py-3 rounded-xl hover:bg-pink-50 transition-colors touch-manipulation">
              <Heart className="w-5 h-5" />
              <span className="font-semibold">Add to Wishlist</span>
            </button>
          </div>

          {/* Quick Product Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 mt-6">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-500" />
                <span className="text-gray-600">Same day delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-500" />
                <span className="text-gray-600">Fresh {shelfLife}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickView;