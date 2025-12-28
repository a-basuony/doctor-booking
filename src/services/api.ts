import axios from "axios";

// Base URL Configuration
export const API_BASE_URL =
  "https://round8-backend-team-one.huma-volve.com/api";

// Create Axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor to add auth token dynamically
api.interceptors.request.use(
  (config) => {
    // Get auth token from localStorage
    const authToken = localStorage.getItem("authToken");
    
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
      console.log('🔐 Request with auth token:', config.url);
    } else {
      // If no auth token, try public API key
      const publicApiKey = import.meta.env.VITE_PUBLIC_API_KEY;
      if (publicApiKey) {
        config.headers.Authorization = `Bearer ${publicApiKey}`;
        console.log('🔑 Request with public key:', config.url);
      } else {
        console.warn('⚠️ No auth token or public key available for:', config.url);
      }
    }
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response success:', response.config.url, response.status);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    
    console.error(`❌ Response error [${status}]:`, url, error.response?.data);
    
      // Handle 401 Unauthorized
    if (status === 401) {
      const errorMessage = error.response?.data?.message || 'Unauthorized - Please login';
      console.error('🔒 Authentication required for URL:', url);
      console.error('🔒 Error details:', errorMessage);
      
      // DEBUG: Log the full error to see what's happening
      console.log('🐞 Full 401 Error Object:', error);

      // Only redirect to login for certain endpoints
      if (url && !url.includes('/auth/')) {
        console.warn('💡 Tip: You need to login first to use this feature');
      }
      
      // Token expired or invalid - clear auth data and redirect
      // TEMPORARILY DISABLED FOR DEBUGGING - The user reported issues with persistence
      // localStorage.removeItem("authToken");
      
      // if (url && !url.includes('/auth/')) {
      //   console.warn('⛔ Auto-logout prevented for debugging. URL causing 401:', url);
      //   // window.location.href = "/sign-in";
      // }
    }
    
    return Promise.reject(error);
  }
);

// Payment API endpoints
export const paymentAPI = {
  // Process payment
  processPayment: (data: {
    booking_id: string;
    gateway: 'stripe';
    payment_method_id?: string;
  }) => api.post('/payments/process', data),

  // Saved cards endpoints
  listCards: () => api.get('/saved-cards'),

  saveCard: (data: {
    provider_token: string;
    brand: string;
    last_four: string;
    exp_month: number;
    exp_year: number;
    is_default?: boolean;
  }) => api.post('/saved-cards', data),

  updateCard: (id: number, data: {
    exp_month: number;
    exp_year: number;
    is_default?: boolean;
  }) => api.put(`/saved-cards/${id}`, data),

  deleteCard: (id: number) => api.delete(`/saved-cards/${id}`),

  setDefaultCard: (id: number) => api.put(`/saved-cards/${id}/default`),
};
