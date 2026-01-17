import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // This allows cookies (refresh tokens) to be sent/received
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the Access Token if it exists
api.interceptors.request.use(
  (config) => {
    // We will store the access token in memory or localStorage later.
    // For now, this is ready to accept the logic.
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;