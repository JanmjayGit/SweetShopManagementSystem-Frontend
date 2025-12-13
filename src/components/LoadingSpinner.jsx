import React from 'react';
import { Candy } from 'lucide-react';

const LoadingSpinner = ({ size = 'medium', message = 'Loading...', fullScreen = false }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-16 h-16',
    large: 'w-24 h-24'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50'
    : 'flex items-center justify-center py-20';

  return (
    <div className={containerClasses}>
      <div className="text-center">
        {/* Animated Sweet Icon */}
        <div className="relative mb-4">
          <div className={`${sizeClasses[size]} mx-auto`}>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse"></div>
            <div className="relative flex items-center justify-center w-full h-full">
              <Candy className="w-1/2 h-1/2 text-white animate-bounce" />
            </div>
          </div>
          
          {/* Spinning Border */}
          <div className={`absolute inset-0 ${sizeClasses[size]} mx-auto border-4 border-transparent border-t-purple-500 rounded-full animate-spin`}></div>
        </div>
        
        {/* Loading Text */}
        <p className="text-gray-600 font-semibold animate-pulse">{message}</p>
        
        {/* Loading Dots */}
        <div className="flex justify-center space-x-1 mt-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;