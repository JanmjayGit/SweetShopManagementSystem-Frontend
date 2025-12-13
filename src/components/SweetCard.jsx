import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Candy, Plus, ShoppingCart, Star, Heart, Eye } from 'lucide-react';

const SweetCard = ({ sweet, onAddToCart, showAddButton = true, isAuthenticated = false, cartQuantity = 0, disableNavigation = false }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  
  const {
    name,
    category,
    price,
    quantity,
    imageUrl
  } = sweet;

  const isOutOfStock = quantity === 0;
  const isLowStock = quantity > 0 && quantity < 10;

  const handleAddClick = (e) => {
    e.stopPropagation(); // Prevent card click
    if (onAddToCart) {
      onAddToCart(sweet);
    }
  };

  const toggleFavorite = (e) => {
    e.stopPropagation(); // Prevent card click
    setIsFavorite(!isFavorite);
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 hover:shadow-2xl transition-all duration-300 group ${disableNavigation ? '' : 'cursor-pointer'}`}
      onClick={disableNavigation ? undefined : () => navigate(`/sweet/${sweet.id}`)}
    >
      {/* Image Section */}
      <div className="relative h-48 bg-gradient-to-br from-pink-200 to-purple-200 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Fallback Icon */}
        <div 
          className="w-full h-full flex items-center justify-center"
          style={{ display: imageUrl ? 'none' : 'flex' }}
        >
          <Candy className="w-20 h-20 text-purple-300" />
        </div>
        
        {/* Stock Badge */}
        <div className="absolute top-2 right-2">
          {isOutOfStock ? (
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              Only {quantity} Left
            </span>
          ) : (
            <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              In Stock
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button 
          className="absolute top-2 left-2 bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110 transform"
          onClick={toggleFavorite}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-pink-500'}`} />
        </button>

        {/* View Details Button */}
        {!disableNavigation && (
          <button 
            className="absolute top-2 right-12 bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110 transform"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/sweet/${sweet.id}`);
            }}
          >
            <Eye className="w-5 h-5 text-purple-500" />
          </button>
        )}

        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Click to view details text */}
        {!disableNavigation && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white bg-opacity-90 rounded-lg px-4 py-2 shadow-lg">
              <p className="text-sm font-semibold text-gray-800">Click to view details</p>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title and Rating */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-1 flex-1">
            {name}
          </h3>
          <div className="flex items-center gap-1 text-yellow-500 ml-2">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-semibold">4.5</span>
          </div>
        </div>

        {/* Category Badge */}
        <div className="mb-3">
          <span className="inline-block bg-purple-100 text-purple-600 text-xs font-semibold px-3 py-1 rounded-full">
            {category}
          </span>
        </div>

        {/* Price and Action Section */}
        <div className="flex items-center justify-between mt-4">
          {/* Price */}
          <div>
            <span className="text-2xl font-bold text-purple-600">
              ₹{price.toFixed(2)}
            </span>
            <span className="text-gray-500 text-sm ml-1">/piece</span>
          </div>
          
          {/* Action Button */}
          {showAddButton && (
            <button
              onClick={handleAddClick}
              disabled={isOutOfStock}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                isOutOfStock
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
            >
              {isAuthenticated ? (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Order</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Low Stock Warning */}
        {isLowStock && !isOutOfStock && (
          <div className="mt-3 flex items-center gap-1 text-orange-600">
            <svg 
              className="w-4 h-4" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs font-semibold">Hurry! Limited stock</span>
          </div>
        )}

        {/* Availability Info */}
        <div className="mt-2 pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            {quantity > 0 ? (
              <span className="text-green-600 font-semibold">✓ Available for delivery</span>
            ) : (
              <span className="text-red-600 font-semibold">✗ Currently unavailable</span>
            )}
          </p>
        </div>
      </div>


    </div>
  );
};

export default SweetCard;