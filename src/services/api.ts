import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.DEV ? "/api" : "https://round8-backend-team-one.huma-volve.com/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // First check for user auth token from localStorage
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    } else {
      // Fallback to public API key if no user token
      const publicApiKey = import.meta.env.VITE_PUBLIC_API_KEY;
      if (publicApiKey) {
        config.headers.Authorization = `Bearer ${publicApiKey}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
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
