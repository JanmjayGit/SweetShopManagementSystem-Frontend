import React from 'react';
import { 
  Candy, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Heart,
  Shield,
  Truck,
  Clock
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-white p-2 rounded-lg">
                <Candy className="w-8 h-8 text-purple-500" />
              </div>
              <span className="text-2xl font-bold">Sweet Shop</span>
            </div>
            <p className="text-pink-100 leading-relaxed">
              Crafting premium handmade sweets since 2020. We bring joy to every celebration with our delicious treats made from the finest ingredients.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Quick Links</h3>
            <ul className="space-y-2">
              {[
                'About Us',
                'Our Story',
                'Ingredients',
                'Nutrition Info',
                'Bulk Orders',
                'Gift Cards',
                'Careers',
                'Press'
              ].map((link) => (
                <li key={link}>
                  <a href="#" className="text-pink-100 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Customer Service</h3>
            <ul className="space-y-2">
              {[
                'Help Center',
                'Track Your Order',
                'Returns & Exchanges',
                'Shipping Info',
                'Size Guide',
                'Care Instructions',
                'Contact Us',
                'FAQ'
              ].map((link) => (
                <li key={link}>
                  <a href="#" className="text-pink-100 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-pink-200" />
                <span className="text-pink-100">
                  123 Sweet Street<br />
                  Candy Lane, Sugar City<br />
                  PIN: 560001
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-pink-200" />
                <span className="text-pink-100">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-pink-200" />
                <span className="text-pink-100">hello@sweetshop.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-pink-200" />
                <span className="text-pink-100">
                  Mon-Sat: 9AM-9PM<br />
                  Sunday: 10AM-6PM
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="border-t border-pink-300 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold">Free Delivery</h4>
                <p className="text-pink-100 text-sm">On orders above ₹500</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold">Secure Payments</h4>
                <p className="text-pink-100 text-sm">100% secure transactions</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold">Made with Love</h4>
                <p className="text-pink-100 text-sm">Handcrafted daily</p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-pink-300 mt-8 pt-8">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Stay Sweet with Us!</h3>
            <p className="text-pink-100 mb-6">
              Subscribe to our newsletter for exclusive offers, new product launches, and sweet surprises!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black bg-opacity-20 border-t border-pink-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-pink-100 text-sm">
              © 2024 Sweet Shop. All rights reserved. Made with ❤️ for sweet lovers.
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <a href="#" className="text-pink-100 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-pink-100 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-pink-100 hover:text-white transition-colors">Cookie Policy</a>
              <a href="#" className="text-pink-100 hover:text-white transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;