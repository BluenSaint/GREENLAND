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
      // Demo authentication with local credentials
      const validCredentials: { [key: string]: { password: string; userData: Partial<AuthUser> } } = {
        'admin@creditfix.com': {
          password: 'admin123',
          userData: {
            id: '00000000-0000-0000-0000-000000000001',
            email: 'admin@creditfix.com',
            role: 'admin',
            first_name: 'Admin',
            last_name: 'User',
            firstName: 'Admin',
            lastName: 'User',
            avatar_url: null,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            permissions: ['all']
          }
        },
        'specialist@creditfix.com': {
          password: 'specialist123',
          userData: {
            id: '00000000-0000-0000-0000-000000000002',
            email: 'specialist@creditfix.com',
            role: 'specialist',
            first_name: 'Credit',
            last_name: 'Specialist',
            firstName: 'Credit',
            lastName: 'Specialist',
            avatar_url: null,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            permissions: ['client_management', 'dispute_management', 'reports']
          }
        },
        'john.smith@email.com': {
          password: 'client123',
          userData: {
            id: '00000000-0000-0000-0000-000000000003',
            email: 'john.smith@email.com',
            role: 'client',
            first_name: 'John',
            last_name: 'Smith',
            firstName: 'John',
            lastName: 'Smith',
            avatar_url: null,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            permissions: ['client_portal']
          }
        },
        'emily.rodriguez@email.com': {
          password: 'client123',
          userData: {
            id: '00000000-0000-0000-0000-000000000004',
            email: 'emily.rodriguez@email.com',
            role: 'client',
            first_name: 'Emily',
            last_name: 'Rodriguez',
            firstName: 'Emily',
            lastName: 'Rodriguez',
            avatar_url: null,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            permissions: ['client_portal']
          }
        }
      };

      const credential = validCredentials[email];
      
      if (!credential || credential.password !== password) {
        return { user: null, error: 'Invalid email or password' };
      }

      const authUser: AuthUser = credential.userData as AuthUser;
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