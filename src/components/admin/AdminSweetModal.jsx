import { useState, useEffect } from 'react';
import { X, Candy, Upload } from 'lucide-react';

const AdminSweetModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingSweet, 
  loading 
}) => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    description: "",
    imageFile: null,
    imagePreview: null
  });

  const [formErrors, setFormErrors] = useState({});

  const categories = [
    "Chocolate", "Cake", "Candy", "Cookies", "Sweets", 
    "Pastries", "Tart", "Macaron", "Fudge", "Ice Cream"
  ];

  useEffect(() => {
    if (editingSweet) {
      setForm({
        name: editingSweet.name,
        category: editingSweet.category,
        price: editingSweet.price,
        quantity: editingSweet.quantity,
        description: editingSweet.description || "",
        imageFile: null,
        imagePreview: editingSweet.imageUrl || null
      });
    } else {
      resetForm();
    }
  }, [editingSweet, isOpen]);

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
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({ 
        ...prev, 
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!form.name.trim()) errors.name = 'Sweet name is required';
    if (!form.category) errors.category = 'Category is required';
    if (!form.price || parseFloat(form.price) <= 0) errors.price = 'Valid price is required';
    if (!form.quantity || parseInt(form.quantity) < 0) errors.quantity = 'Valid quantity is required';
    if (!form.description.trim()) errors.description = 'Description is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const sweetData = {
      name: form.name.trim(),
      category: form.category,
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity),
      description: form.description.trim()
    };

    onSubmit(sweetData, form.imageFile, editingSweet);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-full p-3 shadow-lg">
                <Candy className="w-8 h-8 text-purple-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {editingSweet ? "Edit Sweet" : "Add New Sweet"}
                </h2>
                <p className="text-pink-100 mt-1">
                  {editingSweet ? "Update sweet details" : "Create a delicious new sweet"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
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
                  value={form.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    formErrors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                  }`}
                  placeholder="Enter sweet name"
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
                  value={form.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    formErrors.category ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                  }`}
                >
                  <option value="">Select Category</option>
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
                    value={form.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                      formErrors.price ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                    }`}
                    placeholder="0.00"
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
                    value={form.quantity}
                    onChange={handleInputChange}
                    min="0"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                      formErrors.quantity ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                    }`}
                    placeholder="0"
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
                  value={form.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors resize-none ${
                    formErrors.description ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                  }`}
                  placeholder="Describe your sweet..."
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
                        onClick={() => setForm(prev => ({ ...prev, imagePreview: null, imageFile: null }))}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="py-8">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-2">Click to upload image</p>
                      <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 10MB</p>
                    </div>
                  )}
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Sweet Preview Card */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-700 mb-3">Preview</h4>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <h5 className="font-bold text-gray-800">{form.name || "Sweet Name"}</h5>
                  <p className="text-sm text-purple-600">{form.category || "Category"}</p>
                  <p className="text-lg font-bold text-purple-700">₹{form.price || "0.00"}</p>
                  <p className="text-xs text-gray-500 mt-1">Stock: {form.quantity || "0"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex gap-3 pt-6 mt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : (editingSweet ? "Update Sweet" : "Add Sweet")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSweetModal;