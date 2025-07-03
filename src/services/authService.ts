import { supabase } from '../lib/supabase';
import type { User } from '../lib/supabase';

export interface AuthUser extends User {
  firstName: string;
  lastName: string;
  permissions: string[];
}

export const authService = {
  async signIn(email: string, password: string): Promise<{ user: AuthUser | null; error: string | null }> {
    try {
      // For demo purposes, we'll simulate authentication with the existing users
      // In production, you would use Supabase Auth
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (error || !users) {
        return { user: null, error: 'Invalid email or password' };
      }

      // Simulate password check (in production, use Supabase Auth)
      const validPasswords: { [key: string]: string } = {
        'admin@creditfix.com': 'admin123',
        'specialist@creditfix.com': 'specialist123',
        'john.smith@email.com': 'client123',
        'emily.rodriguez@email.com': 'client123'
      };

      if (validPasswords[email] !== password) {
        return { user: null, error: 'Invalid email or password' };
      }

      const authUser: AuthUser = {
        ...users,
        firstName: users.first_name,
        lastName: users.last_name,
        permissions: users.role === 'admin' ? ['all'] : 
                    users.role === 'specialist' ? ['client_management', 'dispute_management', 'reports'] :
                    ['client_portal']
      };

      return { user: authUser, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { user: null, error: 'Authentication failed' };
    }
  },

  async signOut(): Promise<void> {
    // In production, use supabase.auth.signOut()
    return Promise.resolve();
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    // In production, get from supabase.auth.getUser()
    return null;
  }
};