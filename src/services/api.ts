import axios from "axios";

// Base URL Configuration
export const API_BASE_URL = "https://round8-backend-team-one.huma-volve.com/api";

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
    // Get token from localStorage
    const authToken = localStorage.getItem("authToken");

    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    } else {
      // If no user token, use public API key if available
      const publicApiKey = import.meta.env.VITE_PUBLIC_API_KEY;
      if (publicApiKey) {
        config.headers.Authorization = `Bearer ${publicApiKey}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth data
      localStorage.removeItem("authToken");
      window.location.href = "/sign-in";
    }
    return Promise.reject(error);
  }
);
