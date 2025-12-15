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

// Import the new modular components
import AdminHeader from "../components/admin/AdminHeader";
import AdminStats from "../components/admin/AdminStats";
import AdminSweetsList from "../components/admin/AdminSweetsList";
import AdminSweetModal from "../components/admin/AdminSweetModal";

export default function AdminPanel() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);
  const [sweets, setSweets] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (!authLoading && user && user.role !== 'ADMIN') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/dashboard');
    }
  }, [user, authLoading, navigate]);

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

  // Handle modal submit
  const handleModalSubmit = async (sweetData, imageFile, editingSweet) => {
    try {
      setSubmitting(true);
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
      if (imageFile && sweetId) {
        try {
          await uploadSweetImage(sweetId, imageFile);
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

      setModalOpen(false);
      setEditingSweet(null);
      loadSweets();

    } catch (err) {
      const errorMessage = err.response?.data?.message || "Operation failed";
      toast.error(errorMessage);
      console.error('Error:', err);
    } finally {
      setSubmitting(false);
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
    setModalOpen(true);
  };

  // Open Add Modal
  const openAddModal = () => {
    setEditingSweet(null);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header Component */}
      <AdminHeader 
        user={user}
        onNavigateBack={() => navigate('/dashboard')}
        onAddSweet={openAddModal}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Component */}
        <AdminStats sweets={sweets} />

        {/* Sweet List Component */}
        <AdminSweetsList
          sweets={sweets}
          loading={loading}
          onEditSweet={openEditModal}
          onImageUpload={handleImageUpload}
          onRestock={handleRestock}
          onDelete={handleDelete}
        />
      </div>

      {/* Sweet Modal Component */}
      <AdminSweetModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        editingSweet={editingSweet}
        loading={submitting}
      />


    </div>
  );
}
