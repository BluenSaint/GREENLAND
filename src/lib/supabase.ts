import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'specialist' | 'client';
  first_name: string;
  last_name: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  user_id: string;
  case_number: string;
  status: 'active' | 'pending' | 'completed' | 'suspended';
  assigned_specialist_id?: string;
  start_date: string;
  package_type: string;
  monthly_fee: number;
  contract_signed: boolean;
  contract_signed_date?: string;
  personal_info: any;
  created_at: string;
  updated_at: string;
  user?: User;
  assigned_specialist?: User;
}

export interface CreditScore {
  id: string;
  client_id: string;
  equifax: number;
  experian: number;
  transunion: number;
  average: number;
  score_date: string;
  created_at: string;
}

export interface NegativeItem {
  id: string;
  client_id: string;
  type: string;
  creditor: string;
  account: string;
  amount: number;
  status: 'pending' | 'in_progress' | 'removed' | 'verified';
  bureau: string;
  dispute_reason: string;
  date_reported: string;
  date_removed?: string;
  last_disputed?: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  client_id: string;
  name: string;
  type: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  uploaded_by?: string;
  created_at: string;
}

export interface DisputeTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  template_content: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Communication {
  id: string;
  client_id: string;
  type: 'email' | 'sms' | 'dispute_letter' | 'response';
  subject?: string;
  content: string;
  sent_by?: string;
  sent_at: string;
  status: 'draft' | 'sent' | 'delivered' | 'failed';
}