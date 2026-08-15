import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Interceptor to attach JWT token to every outgoing HTTP request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('scamgraph_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication Endpoints
export const signupUser = async (name, email, password) => {
  const response = await api.post('/auth/signup', { name, email, password });
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// CTI / CSI Scam Graph Endpoints
export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export const searchScamEntities = async (query = '') => {
  const response = await api.get(`/scam-entities/search?q=${encodeURIComponent(query)}`);
  return response.data;
};

export const getInvestigationGraph = async (entityId) => {
  const response = await api.get(`/scam-entities/${entityId}/graph`);
  return response.data;
};

export const getSharedIndicatorOverlaps = async (entityId) => {
  const response = await api.get(`/scam-entities/${entityId}/overlaps`);
  return response.data;
};