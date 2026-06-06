import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginUser, logoutUser } from '../services/auth.service';
import api from '../lib/axios';

const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      isLoading: false,
      error: null,

      checkAuth: async () => {
        try {
          await api.get('/auth/me');
          set({ isAuthenticated: true });
        } catch {
          set({ isAuthenticated: false });
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const data = await loginUser(email, password);
          if (data.success) {
            set({ isAuthenticated: true, isLoading: false });
            return { success: true };
          } else {
            set({ error: data.message || 'Login failed', isLoading: false });
            return { success: false, message: data.message || 'Login failed' };
          }
        } catch (error) {
          const message = error.response?.data?.message || 'An error occurred during login';
          set({ error: message, isLoading: false });
          return { success: false, message };
        }
      },

      logout: async () => {
        try {
          await logoutUser();
        } catch {
        }
        set({ isAuthenticated: false, error: null });
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;
