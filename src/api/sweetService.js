import axiosInstance from './axiosConfig';
import { apiEndpoints } from './apiEndpoints';

export const getAllSweets = async () => {
  const response = await axiosInstance.get(apiEndpoints.GET_ALL_SWEETS);
  return response;
};

export const addSweet = async (sweetData) => {
  const response = await axiosInstance.post(apiEndpoints.ADD_SWEET, sweetData);
  return response;
};

export const updateSweet = async (id, sweetData) => {
  const response = await axiosInstance.put(apiEndpoints.UPDATE_SWEET(id), sweetData);
  return response;
};

export const deleteSweet = async (id) => {
  const response = await axiosInstance.delete(apiEndpoints.DELETE_SWEET(id));
  return response;
};

export const restockSweet = async (id, quantity) => {
  const response = await axiosInstance.post(apiEndpoints.RESTOCK(id), { quantity });
  return response;
};

export const uploadSweetImage = async (id, file) => {
  const formData = new FormData();
  formData.append('file', file); // Changed from 'image' to 'file' to match backend
  
  const response = await axiosInstance.post(apiEndpoints.UPLOAD_IMAGE(id), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};

export const searchSweets = async (query) => {
  const response = await axiosInstance.get(`${apiEndpoints.SEARCH}?q=${encodeURIComponent(query)}`);
  return response;
};