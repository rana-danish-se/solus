import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    // The server uses httpOnly cookies, so we don't need to manually attach a Bearer token here.
    // 'withCredentials: true' ensures the cookie is sent automatically.
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors: clear auth state
      import('../store/useAuthStore').then((module) => {
        const useAuthStore = module.default;
        useAuthStore.getState().logout();
        
        // Redirect to login if not already there
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      });
    }
    return Promise.reject(error);
  }
);

export default api;
