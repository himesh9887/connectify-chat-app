import axios from 'axios';

const API_BASE = 'http://localhost:5000/api'; // Backend URL

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const chatAPI = {
  getUsers: () => api.get('/users'),
  getMessages: (userId) => api.get(`/messages/${userId}`),
};

export default api;

