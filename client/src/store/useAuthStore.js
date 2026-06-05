import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginUser, logoutUser } from '../services/auth.service';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const data = await loginUser(email, password);
          if (data.success) {
            set({ 
              user: data.user || { email }, // Fallback if API doesn't return user
              token: data.token || null,
              isAuthenticated: true, 
              isLoading: false 
            });
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
          // Server logout is best-effort; clear local state regardless
        }
        set({ user: null, token: null, isAuthenticated: false, error: null });
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage', // Name of the storage key
    }
  )
);

export default useAuthStore;
