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
      // First try to authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        console.error('Supabase auth error:', authError);
        
        // Fallback to demo authentication if Supabase auth fails
        return this.demoSignIn(email, password);
      }

      if (!authData.user) {
        return { user: null, error: 'User not found' };
      }

      // Get user data from the users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (userError || !userData) {
        console.error('User data error:', userError);
        
        // Fallback to demo authentication if user data fetch fails
        return this.demoSignIn(email, password);
      }

      // Map database user to AuthUser
      const authUser: AuthUser = {
        ...userData,
        firstName: userData.first_name,
        lastName: userData.last_name,
        permissions: userData.role === 'admin' 
          ? ['all'] 
          : userData.role === 'specialist'
          ? ['client_management', 'dispute_management', 'reports']
          : ['client_portal']
      };

      return { user: authUser, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      
      // Fallback to demo authentication if any error occurs
      return this.demoSignIn(email, password);
    }
  },

  async demoSignIn(email: string, password: string): Promise<{ user: AuthUser | null; error: string | null }> {
    // Demo authentication with local credentials
    const validCredentials: { [key: string]: { password: string; userData: Partial<AuthUser> } } = {
      'admin@creditfix.com': {
        password: 'admin123',
        userData: {
          id: '550e8400-e29b-41d4-a716-446655440001',
          email: 'admin@creditfix.com',
          role: 'admin',
          first_name: 'Sarah',
          last_name: 'Johnson',
          firstName: 'Sarah',
          lastName: 'Johnson',
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
          id: '550e8400-e29b-41d4-a716-446655440002',
          email: 'specialist@creditfix.com',
          role: 'specialist',
          first_name: 'Michael',
          last_name: 'Davis',
          firstName: 'Michael',
          lastName: 'Davis',
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
          id: '550e8400-e29b-41d4-a716-446655440003',
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
          id: '550e8400-e29b-41d4-a716-446655440004',
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
  },

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
    return Promise.resolve();
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    const { data } = await supabase.auth.getUser();
    
    if (!data.user) {
      return null;
    }
    
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', data.user.email)
      .single();
      
    if (error || !userData) {
      return null;
    }
    
    return {
      ...userData,
      firstName: userData.first_name,
      lastName: userData.last_name,
      permissions: userData.role === 'admin' 
        ? ['all'] 
        : userData.role === 'specialist'
        ? ['client_management', 'dispute_management', 'reports']
        : ['client_portal']
    };
  }
};