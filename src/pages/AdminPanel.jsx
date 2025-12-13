import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllSweets,
  addSweet,
  updateSweet,
  deleteSweet,
  restockSweet,
  uploadSweetImage,
} from "../api/sweetService";

import toast from "react-hot-toast";
import { AuthContext } from '../context/AuthContext';
import { 
  PlusCircle, 
  Trash, 
  Edit, 
  Upload, 
  Package, 
  DollarSign, 
  TrendingUp,
  ArrowLeft,
  Candy,
  X
} from "lucide-react";
import SweetCard from "../components/SweetCard";

export default function AdminPanel() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const [sweets, setSweets] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is admin
  useEffect(() => {
    if (!authLoading && user && user.role !== 'ADMIN') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/dashboard');
    }
  }, [user, authLoading, navigate]);



  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    description: "",
    imageFile: null,
    imagePreview: null
  });

  const [categories] = useState([
    'Chocolate', 'Candy', 'Cake', 'Cookies', 'Sweets','Pastries', 
    'Ice Cream', 'Donuts', 'Muffins', 'Tarts', 'Fudge',
    'Caramel', 'Fruit', 'Nuts', 'Gummies', 'Hard Candy'
  ]);
  const [formErrors, setFormErrors] = useState({});
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkData, setBulkData] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filteredSweets, setFilteredSweets] = useState([]);

  // Component only renders if user is admin (handled by ProtectedRoute)
  useEffect(() => {
    loadSweets();
  }, []);

  // Filter sweets when search or category changes
  useEffect(() => {
    let filtered = sweets;

    if (filterCategory !== 'All') {
      filtered = filtered.filter(sweet => sweet.category === filterCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(sweet =>
        sweet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sweet.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredSweets(filtered);
  }, [sweets, searchQuery, filterCategory]);

  // Fetch sweets
  const loadSweets = async () => {
    try {
      setLoading(true);
      const res = await getAllSweets();
      setSweets(res.data);
    } catch (err) {
      toast.error("Failed to fetch sweets");
      console.error('Error loading sweets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSweets();
  }, []);

  // Handle Form Input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  // Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setForm({ 
        ...form, 
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  // Validate Form
  const validateForm = () => {
    const errors = {};
    
    if (!form.name.trim()) errors.name = 'Sweet name is required';
    if (!form.category.trim()) errors.category = 'Category is required';
    if (!form.price || parseFloat(form.price) <= 0) errors.price = 'Valid price is required';
    if (!form.quantity || parseInt(form.quantity) < 0) errors.quantity = 'Valid quantity is required';
    if (!form.description.trim()) errors.description = 'Description is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add or Update Sweet
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    try {
      const sweetData = {
        name: form.name.trim(),
        category: form.category,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity),
        description: form.description.trim()
      };

      let sweetId;
      
      if (editingSweet) {
        await updateSweet(editingSweet.id, sweetData);
        sweetId = editingSweet.id;
        toast.success("Sweet updated successfully!");
      } else {
        const response = await addSweet(sweetData);
        sweetId = response.data?.id || response.data;
        toast.success("Sweet added successfully!");
      }

      // Upload image if provided
      if (form.imageFile && sweetId) {
        try {
          await uploadSweetImage(sweetId, form.imageFile);
          toast.success("Sweet and image uploaded successfully!");
        } catch (imageError) {
          const errorMsg = imageError.response?.data?.message || imageError.message;
          const errorStatus = imageError.response?.status;
          
          if (errorStatus === 403) {
            toast.error("Sweet saved but image upload failed: Admin permission required");
          } else if (errorStatus === 401) {
            toast.error("Sweet saved but image upload failed: Authentication required");
          } else if (errorStatus === 400) {
            toast.error("Sweet saved but image upload failed: Invalid file format");
          } else if (errorStatus === 500) {
            toast.error("Sweet saved but image upload failed: Server error");
          } else {
            toast.error(`Sweet saved but image upload failed: ${errorMsg}`);
          }
        }
      }

      resetForm();
      setModalOpen(false);
      loadSweets();

    } catch (err) {
      const errorMessage = err.response?.data?.message || "Operation failed";
      toast.error(errorMessage);
      console.error('Error:', err);
    }
  };

  // Reset Form
  const resetForm = () => {
    setForm({
      name: "",
      category: "",
      price: "",
      quantity: "",
      description: "",
      imageFile: null,
      imagePreview: null
    });
    setFormErrors({});
    setEditingSweet(null);
  };

  // Handle Bulk Import
  const handleBulkImport = async () => {
    if (!bulkData.trim()) {
      toast.error('Please enter sweet data');
      return;
    }

    try {
      const lines = bulkData.trim().split('\n');
      let successCount = 0;
      let errorCount = 0;

      for (const line of lines) {
        if (!line.trim()) continue;
        
        const [name, category, price, quantity, description] = line.split(',').map(item => item.trim());
        
        if (!name || !category || !price || !quantity) {
          errorCount++;
          continue;
        }

        try {
          const sweetData = {
            name,
            category,
            price: parseFloat(price),
            quantity: parseInt(quantity),
            description: description || `Delicious ${name}`
          };

          await addSweet(sweetData);
          successCount++;
        } catch (error) {
          errorCount++;
          console.error(`Error adding ${name}:`, error);
        }
      }

      toast.success(`Successfully added ${successCount} sweets!`);
      if (errorCount > 0) {
        toast.error(`Failed to add ${errorCount} sweets`);
      }

      setBulkData('');
      setShowBulkImport(false);
      loadSweets();
    } catch (error) {
      toast.error('Bulk import failed');
      console.error('Bulk import error:', error);
    }
  };

  // Delete Sweet
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await deleteSweet(id);
      toast.success("Sweet deleted successfully!");
      loadSweets();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to delete sweet";
      toast.error(errorMessage);
    }
  };

  // Restock Sweet
  const handleRestock = async (id, currentQty) => {
    const qty = prompt(`Current stock: ${currentQty}\nEnter quantity to add:`);
    if (!qty || isNaN(qty) || parseInt(qty) <= 0) return;

    try {
      await restockSweet(id, parseInt(qty));
      toast.success("Restocked successfully!");
      loadSweets();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Restock failed";
      toast.error(errorMessage);
    }
  };

  // Upload Image
  const handleImageUpload = async (id, file) => {
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    try {
      await uploadSweetImage(id, file);
      toast.success("Image uploaded successfully!");
      loadSweets();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Upload failed";
      toast.error(errorMessage);
    }
  };

  // Open Edit Modal
  const openEditModal = (sweet) => {
    setEditingSweet(sweet);
    setForm({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price,
      quantity: sweet.quantity,
      description: sweet.description || "",
      imageFile: null,
      imagePreview: sweet.imageUrl || null
    });
    setFormErrors({});
    setModalOpen(true);
  };

  // Open Add Modal
  const openAddModal = () => {
    resetForm();
    setModalOpen(true);
  };

  // Calculate stats
  const totalSweets = sweets.length;
  const totalValue = sweets.reduce((sum, sweet) => sum + (sweet.price * sweet.quantity), 0);
  const lowStockItems = sweets.filter(sweet => sweet.quantity < 10).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-2 rounded-lg">
                  <Candy className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all font-semibold"
              >
                <PlusCircle size={20} />
                <span>Add Sweet</span>
              </button>
              
              <button
                onClick={() => setShowBulkImport(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all font-semibold"
              >
                <Upload size={20} />
                <span className="hidden sm:inline">Bulk Import</span>
              </button>


              

            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{totalSweets}</p>
              </div>
              <Package className="w-12 h-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Value</p>
                <p className="text-3xl font-bold text-gray-900">₹{totalValue.toFixed(2)}</p>
              </div>
              <DollarSign className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Low Stock</p>
                <p className="text-3xl font-bold text-gray-900">{lowStockItems}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search sweets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div className="md:w-48">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
              >
                <option value="All">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
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
                          onClick={() => openEditModal(sweet)}
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
                            onChange={(e) => handleImageUpload(sweet.id, e.target.files[0])}
                          />
                        </label>

                        {/* Restock */}
                        <button
                          onClick={() => handleRestock(sweet.id, sweet.quantity)}
                          className="bg-yellow-500 text-white p-3 rounded-full shadow-lg hover:bg-yellow-600 transform hover:scale-110 transition-all"
                          title="Restock"
                        >
                          <Package size={18} />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(sweet.id, sweet.name)}
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
                  className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="text-center py-20">
                <Candy className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-400 mb-2">No sweets yet</h3>
                <p className="text-gray-500 mb-6">Start by adding your first sweet to the inventory</p>
                <button
                  onClick={openAddModal}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all font-semibold"
                >
                  Add Your First Sweet
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Enhanced Modal For Add / Edit Sweet */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {editingSweet ? "Edit Sweet" : "Add New Sweet"}
                  </h2>
                  <p className="text-pink-100 mt-1">
                    {editingSweet ? "Update sweet details" : "Create a delicious new sweet"}
                  </p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Sweet Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Sweet Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g., Chocolate Truffle"
                      className={`w-full p-3 border-2 rounded-lg focus:outline-none transition-colors ${
                        formErrors.name ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                      }`}
                      value={form.name}
                      onChange={handleChange}
                    />
                    {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      className={`w-full p-3 border-2 rounded-lg focus:outline-none transition-colors ${
                        formErrors.category ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                      }`}
                      value={form.category}
                      onChange={handleChange}
                    >
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {formErrors.category && <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>}
                  </div>

                  {/* Price and Quantity */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Price (₹) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className={`w-full p-3 border-2 rounded-lg focus:outline-none transition-colors ${
                          formErrors.price ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                        }`}
                        value={form.price}
                        onChange={handleChange}
                      />
                      {formErrors.price && <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        placeholder="0"
                        min="0"
                        className={`w-full p-3 border-2 rounded-lg focus:outline-none transition-colors ${
                          formErrors.quantity ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                        }`}
                        value={form.quantity}
                        onChange={handleChange}
                      />
                      {formErrors.quantity && <p className="text-red-500 text-sm mt-1">{formErrors.quantity}</p>}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      placeholder="Describe your sweet..."
                      rows="3"
                      className={`w-full p-3 border-2 rounded-lg focus:outline-none transition-colors resize-none ${
                        formErrors.description ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                      }`}
                      value={form.description}
                      onChange={handleChange}
                    />
                    {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>}
                  </div>
                </div>

                {/* Right Column - Image Upload */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Sweet Image
                    </label>
                    
                    {/* Image Preview */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center relative">
                      {form.imagePreview ? (
                        <div className="relative">
                          <img
                            src={form.imagePreview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, imageFile: null, imagePreview: null })}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-10"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                      ) : (
                        <div className="py-8 relative">
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500 mb-2">Click to upload image</p>
                          <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sweet Preview Card */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-3">Preview</h4>
                    <div className="bg-white rounded-lg shadow-sm p-3">
                      <div className="h-24 bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg mb-3 flex items-center justify-center">
                        {form.imagePreview ? (
                          <img src={form.imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Candy className="w-8 h-8 text-purple-300" />
                        )}
                      </div>
                      <h5 className="font-bold text-sm">{form.name || 'Sweet Name'}</h5>
                      <p className="text-xs text-gray-500">{form.category || 'Category'}</p>
                      <p className="text-sm font-bold text-purple-600 mt-1">
                        ₹{form.price || '0.00'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-6 mt-6 border-t">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all font-semibold"
                >
                  {editingSweet ? "Update Sweet" : "Add Sweet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {showBulkImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-6 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Bulk Import Sweets</h2>
                  <p className="text-indigo-100 mt-1">Add multiple sweets at once</p>
                </div>
                <button
                  onClick={() => setShowBulkImport(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Format Instructions</h3>
                <div className="bg-gray-50 rounded-lg p-4 text-sm">
                  <p className="mb-2">Enter one sweet per line in this format:</p>
                  <code className="bg-white px-2 py-1 rounded text-xs">
                    Name, Category, Price, Quantity, Description
                  </code>
                  <div className="mt-3">
                    <p className="font-semibold mb-1">Example:</p>
                    <div className="bg-white p-2 rounded text-xs font-mono">
                      Chocolate Truffle, Chocolate, 25.99, 50, Rich dark chocolate truffle<br/>
                      Strawberry Cake, Cake, 45.00, 20, Fresh strawberry sponge cake<br/>
                      Vanilla Cookies, Cookies, 15.50, 100, Crispy vanilla cookies
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sweet Data
                </label>
                <textarea
                  value={bulkData}
                  onChange={(e) => setBulkData(e.target.value)}
                  placeholder="Enter sweet data here..."
                  rows="8"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors resize-none font-mono text-sm"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-6 mt-6 border-t">
                <button
                  onClick={() => setShowBulkImport(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkImport}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all font-semibold"
                >
                  Import Sweets
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
