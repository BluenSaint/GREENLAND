import { create } from 'zustand';
import { authService, type AuthUser } from '../services/authService';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const { user, error } = await authService.signIn(email, password);

      if (user) {
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false 
        });
        return true;
      } else {
        set({ 
          error: error || 'Login failed', 
          isLoading: false 
        });
        return false;
      }
    } catch (error) {
      set({ 
        error: 'Login failed. Please try again.', 
        isLoading: false 
      });
      return false;
    }
  },

  logout: async () => {
    try {
      await authService.signOut();
      set({ 
        user: null, 
        isAuthenticated: false, 
        error: null 
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Re-export types for backward compatibility
export type { AuthUser as User };