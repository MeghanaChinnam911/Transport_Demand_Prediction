import axios from 'axios';

// Default to localhost:8000 in dev, or VITE_API_URL if configured
const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export const apiService = {
  getHealth: async () => {
    try {
      const res = await apiClient.get('/api/health');
      return res.data;
    } catch (err) {
      console.warn('Backend connection error:', err.message);
      return { status: 'offline', model_loaded: false };
    }
  },

  getOptions: async () => {
    const res = await apiClient.get('/api/options');
    return res.data;
  },

  getEdaStats: async () => {
    const res = await apiClient.get('/api/eda-stats');
    return res.data;
  },

  getVerifiedExample: async () => {
    const res = await apiClient.get('/api/verified-example');
    return res.data;
  },

  predictDemand: async (inputData) => {
    const res = await apiClient.post('/api/predict', inputData);
    return res.data;
  }
};
