import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'specialist' | 'client';
  firstName: string;
  lastName: string;
  avatar?: string;
  permissions: string[];
  isActive: boolean;
}

interface AuthState {
  user: User | null;
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
          // Simulate API call
          const response = await fetch('/data/users.json');
          const users = await response.json();
          
          const user = users.find((u: any) => 
            u.email === email && u.password === password && u.isActive
          );

          if (user) {
            const { password: _, ...userWithoutPassword } = user;
            set({ 
              user: userWithoutPassword, 
              isAuthenticated: true, 
              isLoading: false 
            });
            return true;
          } else {
            set({ 
              error: 'Invalid email or password', 
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

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false, 
          error: null 
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }));
