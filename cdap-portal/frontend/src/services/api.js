import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const { accessToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

// Service APIs
export const serviceAPI = {
  getAll: () => api.get('/services'),
  getById: (id) => api.get(`/services/${id}`),
  getTemplates: (id) => api.get(`/services/${id}/templates`),
  getPricing: (id) => api.get(`/services/${id}/pricing`),
};

// Tenant APIs
export const tenantAPI = {
  getAll: () => api.get('/tenants'),
  create: (data) => api.post('/tenants', data),
  getById: (id) => api.get(`/tenants/${id}`),
  update: (id, data) => api.put(`/tenants/${id}`, data),
  getServices: (id) => api.get(`/tenants/${id}/services`),
  addService: (id, data) => api.post(`/tenants/${id}/services`, data),
  removeService: (id, serviceId) => api.delete(`/tenants/${id}/services/${serviceId}`),
  getResources: (id) => api.get(`/tenants/${id}/resources`),
};

// Deployment APIs
export const deploymentAPI = {
  getAll: () => api.get('/deployments'),
  create: (data) => api.post('/deployments', data),
  getById: (id) => api.get(`/deployments/${id}`),
  update: (id, data) => api.put(`/deployments/${id}`, data),
  delete: (id) => api.delete(`/deployments/${id}`),
  getLogs: (id) => api.get(`/deployments/${id}/logs`),
  scale: (id, replicas) => api.post(`/deployments/${id}/scale`, { replicas }),
  restart: (id) => api.post(`/deployments/${id}/restart`),
  getStatus: (id) => api.get(`/deployments/${id}/status`),
  rollback: (id, version) => api.post(`/deployments/${id}/rollback`, { targetVersion: version }),
};

export default api;
