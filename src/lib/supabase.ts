import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types will be generated here
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'admin' | 'specialist' | 'client'
          first_name: string
          last_name: string
          avatar_url?: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          role: 'admin' | 'specialist' | 'client'
          first_name: string
          last_name: string
          avatar_url?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'admin' | 'specialist' | 'client'
          first_name?: string
          last_name?: string
          avatar_url?: string
          is_active?: boolean
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          user_id: string
          case_number: string
          status: 'active' | 'pending' | 'completed' | 'suspended'
          assigned_specialist_id: string
          start_date: string
          package_type: string
          monthly_fee: number
          contract_signed: boolean
          contract_signed_date?: string
          personal_info: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          case_number: string
          status?: 'active' | 'pending' | 'completed' | 'suspended'
          assigned_specialist_id: string
          start_date: string
          package_type: string
          monthly_fee: number
          contract_signed?: boolean
          contract_signed_date?: string
          personal_info: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          case_number?: string
          status?: 'active' | 'pending' | 'completed' | 'suspended'
          assigned_specialist_id?: string
          start_date?: string
          package_type?: string
          monthly_fee?: number
          contract_signed?: boolean
          contract_signed_date?: string
          personal_info?: any
          updated_at?: string
        }
      }
      credit_scores: {
        Row: {
          id: string
          client_id: string
          equifax: number
          experian: number
          transunion: number
          average: number
          score_date: string
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          equifax: number
          experian: number
          transunion: number
          average: number
          score_date: string
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          equifax?: number
          experian?: number
          transunion?: number
          average?: number
          score_date?: string
        }
      }
      negative_items: {
        Row: {
          id: string
          client_id: string
          type: string
          creditor: string
          account: string
          amount: number
          status: 'pending' | 'in_progress' | 'removed' | 'verified'
          bureau: string
          dispute_reason: string
          date_reported: string
          date_removed?: string
          last_disputed?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          type: string
          creditor: string
          account: string
          amount: number
          status?: 'pending' | 'in_progress' | 'removed' | 'verified'
          bureau: string
          dispute_reason: string
          date_reported: string
          date_removed?: string
          last_disputed?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          type?: string
          creditor?: string
          account?: string
          amount?: number
          status?: 'pending' | 'in_progress' | 'removed' | 'verified'
          bureau?: string
          dispute_reason?: string
          date_reported?: string
          date_removed?: string
          last_disputed?: string
          updated_at?: string
        }
      }
    }
  }
}