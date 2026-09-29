import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
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

// Response interceptor for unified response unwrapping and error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

// API Service Functions
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  changePassword: (passwords) => api.put('/users/change-password', passwords),
};

export const busService = {
  getAll: () => api.get('/buses'),
  getById: (id) => api.get(`/buses/${id}`),
  create: (data) => api.post('/buses', data),
  update: (id, data) => api.put(`/buses/${id}`, data),
  delete: (id) => api.delete(`/buses/${id}`),
};

export const routeService = {
  getAll: () => api.get('/routes'),
  getById: (id) => api.get(`/routes/${id}`),
  create: (data) => api.post('/routes', data),
  update: (id, data) => api.put(`/routes/${id}`, data),
  delete: (id) => api.delete(`/routes/${id}`),
};

export const scheduleService = {
  getAll: () => api.get('/schedules'),
  search: (from, to, date) => {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    if (date) params.append('date', date);
    return api.get(`/schedules/search?${params.toString()}`);
  },
  getById: (id) => api.get(`/schedules/${id}`),
  create: (data) => api.post('/schedules', data),
  update: (id, data) => api.put(`/schedules/${id}`, data),
  delete: (id) => api.delete(`/schedules/${id}`),
};

export const bookingService = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getMyBookings: () => api.get('/bookings/my'),
  getById: (id) => api.get(`/bookings/${id}`),
  track: (code) => api.get(`/bookings/track/${encodeURIComponent(code)}`),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
  updateTracking: (id, trackingStatus) => api.put(`/bookings/${id}/tracking`, { trackingStatus }),
};

export const reviewService = {
  getByBus: (busId) => api.get(`/reviews/bus/${busId}`),
  create: (reviewData) => api.post('/reviews', reviewData),
};

export const notificationService = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};

export const adminService = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getBookings: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/admin/bookings${query ? `?${query}` : ''}`);
  },
  getUsers: () => api.get('/admin/users'),
  toggleUserStatus: (id) => api.put(`/admin/users/${id}/toggle-status`),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
};

export const operatorService = {
  getBuses: () => api.get('/operator/buses'),
  getSchedules: () => api.get('/operator/schedules'),
  getBookings: () => api.get('/operator/bookings'),
  getStats: () => api.get('/operator/stats'),
};

export default api;
