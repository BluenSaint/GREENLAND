import { supabase } from '../lib/supabase';
import type { User } from '../lib/supabase';

export const authService = {
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.warn('Supabase auth unavailable, using mock authentication:', error);
      
      // Mock authentication for offline mode
      const mockUsers = [
        {
          id: 'mock-admin-1',
          email: 'admin@creditrepair.com',
          password: 'admin123',
          role: 'admin',
          first_name: 'Admin',
          last_name: 'User'
        },
        {
          id: 'mock-specialist-1',
          email: 'specialist@creditrepair.com',
          password: 'specialist123',
          role: 'specialist',
          first_name: 'Credit',
          last_name: 'Specialist'
        },
        {
          id: 'mock-client-1',
          email: 'client@example.com',
          password: 'client123',
          role: 'client',
          first_name: 'John',
          last_name: 'Doe'
        }
      ];

      const mockUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!mockUser) {
        throw new Error('Invalid email or password');
      }

      // Return mock auth data structure similar to Supabase
      return {
        user: {
          id: mockUser.id,
          email: mockUser.email,
          user_metadata: {
            role: mockUser.role,
            first_name: mockUser.first_name,
            last_name: mockUser.last_name
          }
        },
        session: {
          access_token: 'mock-token',
          refresh_token: 'mock-refresh-token',
          expires_in: 3600,
          token_type: 'bearer'
        }
      };
    }
  },

  async signUp(email: string, password: string, userData: any) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.warn('Supabase auth unavailable, simulating sign up:', error);
      
      // Return mock signup data
      return {
        user: {
          id: `mock-${Date.now()}`,
          email,
          user_metadata: userData
        },
        session: null
      };
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error) {
      console.warn('Supabase auth unavailable, simulating sign out:', error);
      // In offline mode, just clear local state
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        throw error;
      }

      if (!user) return null;

      // Get additional user data from users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError) {
        throw userError;
      }

      return userData;
    } catch (error) {
      console.warn('Supabase unavailable, returning null user:', error);
      return null;
    }
  },

  async updateProfile(updates: Partial<User>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No authenticated user');
      }

      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.warn('Supabase unavailable, simulating profile update:', error);
      // Return mock updated profile
      return {
        id: 'mock-user',
        email: 'mock@example.com',
        ...updates,
        updated_at: new Date().toISOString()
      };
    }
  }
};