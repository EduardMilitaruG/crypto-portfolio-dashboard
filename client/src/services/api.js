import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// Asset API functions
export const assetApi = {
  // Get all assets
  getAll: async () => {
    const response = await api.get('/assets');
    return response.data;
  },

  // Get single asset
  getById: async (id) => {
    const response = await api.get(`/assets/${id}`);
    return response.data;
  },

  // Create new asset
  create: async (assetData) => {
    const response = await api.post('/assets', assetData);
    return response.data;
  },

  // Update existing asset
  update: async (id, assetData) => {
    const response = await api.put(`/assets/${id}`, assetData);
    return response.data;
  },

  // Delete asset
  delete: async (id) => {
    const response = await api.delete(`/assets/${id}`);
    return response.data;
  },

  // Batch update crypto prices in database
  updatePrices: async (prices) => {
    const response = await api.post('/assets/update-prices', { prices });
    return response.data;
  },
};

export default api;
