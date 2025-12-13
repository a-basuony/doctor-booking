import axios from "axios";

export const api = axios.create({
  baseURL: "https://round8-cure-php-team-two.huma-volve.com/api/v1/",
});



api.interceptors.request.use((config) => {
  const token = import.meta.env.VITE_PUBLIC_API_KEY;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});



 
