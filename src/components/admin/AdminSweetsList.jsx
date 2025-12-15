import { useState } from 'react';
import { Search, Filter, Edit, Upload, Package, Trash, Candy } from 'lucide-react';
import SweetCard from '../SweetCard';

const AdminSweetsList = ({ 
  sweets, 
  loading, 
  onEditSweet, 
  onImageUpload, 
  onRestock, 
  onDelete 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Filter sweets based on search and category
  const filteredSweets = sweets.filter(sweet => {
    const matchesSearch = sweet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sweet.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || sweet.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...new Set(sweets.map(s => s.category))];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search sweets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="pl-10 pr-8 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors bg-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Sweet List */}
      {filteredSweets.length > 0 ? (
        <>
          <div className="mb-4 text-gray-600">
            Showing {filteredSweets.length} of {sweets.length} sweets
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSweets.map((sweet) => (
              <div key={sweet.id} className="relative group">
                <SweetCard sweet={sweet} showAddButton={false} disableNavigation={true} />

                {/* Admin Actions Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                  <div className="flex gap-2">
                    {/* Edit */}
                    <button
                      onClick={() => onEditSweet(sweet)}
                      className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transform hover:scale-110 transition-all"
                      title="Edit Sweet"
                    >
                      <Edit size={18} />
                    </button>

                    {/* Upload Image */}
                    <label className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 cursor-pointer transform hover:scale-110 transition-all" title="Upload Image">
                      <Upload size={18} />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => onImageUpload(sweet.id, e.target.files[0])}
                      />
                    </label>

                    {/* Restock */}
                    <button
                      onClick={() => onRestock(sweet.id, sweet.quantity)}
                      className="bg-yellow-500 text-white p-3 rounded-full shadow-lg hover:bg-yellow-600 transform hover:scale-110 transition-all"
                      title="Restock"
                    >
                      <Package size={18} />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => onDelete(sweet.id, sweet.name)}
                      className="bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transform hover:scale-110 transition-all"
                      title="Delete Sweet"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : sweets.length > 0 ? (
        <div className="text-center py-20">
          <Candy className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-400 mb-2">No sweets match your search</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterCategory('All');
            }}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all font-semibold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="text-center py-20">
          <Candy className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-400 mb-2">No sweets yet</h3>
          <p className="text-gray-500">Start by adding your first sweet to the inventory</p>
        </div>
      )}
    </div>
  );
};

export default AdminSweetsList;