/*
  # Initial Credit Repair Platform Schema

  1. New Tables
    - `users` - User accounts (admin, specialist, client)
    - `clients` - Client information and case details
    - `credit_scores` - Credit score history tracking
    - `negative_items` - Negative items on credit reports
    - `documents` - Document storage metadata
    - `dispute_templates` - Letter templates for disputes
    - `communications` - Communication history

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'specialist', 'client')),
  first_name text NOT NULL,
  last_name text NOT NULL,
  avatar_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  case_number text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'completed', 'suspended')),
  assigned_specialist_id uuid REFERENCES users(id),
  start_date date NOT NULL,
  package_type text NOT NULL,
  monthly_fee decimal(10,2) NOT NULL,
  contract_signed boolean DEFAULT false,
  contract_signed_date timestamptz,
  personal_info jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Credit scores table
CREATE TABLE IF NOT EXISTS credit_scores (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  equifax integer NOT NULL,
  experian integer NOT NULL,
  transunion integer NOT NULL,
  average integer NOT NULL,
  score_date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Negative items table
CREATE TABLE IF NOT EXISTS negative_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  type text NOT NULL,
  creditor text NOT NULL,
  account text NOT NULL,
  amount decimal(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'removed', 'verified')),
  bureau text NOT NULL,
  dispute_reason text NOT NULL,
  date_reported date NOT NULL,
  date_removed date,
  last_disputed date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL,
  file_path text NOT NULL,
  file_size bigint NOT NULL,
  mime_type text NOT NULL,
  uploaded_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Dispute templates table
CREATE TABLE IF NOT EXISTS dispute_templates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  template_content text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Communications table
CREATE TABLE IF NOT EXISTS communications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('email', 'sms', 'dispute_letter', 'response')),
  subject text,
  content text NOT NULL,
  sent_by uuid REFERENCES users(id),
  sent_at timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'sent' CHECK (status IN ('draft', 'sent', 'delivered', 'failed'))
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE negative_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispute_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for clients
CREATE POLICY "Clients can read own data"
  ON clients
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Specialists can read assigned clients"
  ON clients
  FOR SELECT
  TO authenticated
  USING (
    assigned_specialist_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'specialist')
    )
  );

-- RLS Policies for credit_scores
CREATE POLICY "Users can read own credit scores"
  ON credit_scores
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clients 
      WHERE id = client_id AND (
        user_id = auth.uid() OR 
        assigned_specialist_id = auth.uid() OR
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
      )
    )
  );

-- RLS Policies for negative_items
CREATE POLICY "Users can read own negative items"
  ON negative_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clients 
      WHERE id = client_id AND (
        user_id = auth.uid() OR 
        assigned_specialist_id = auth.uid() OR
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
      )
    )
  );

-- RLS Policies for documents
CREATE POLICY "Users can read own documents"
  ON documents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clients 
      WHERE id = client_id AND (
        user_id = auth.uid() OR 
        assigned_specialist_id = auth.uid() OR
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
      )
    )
  );

-- RLS Policies for dispute_templates
CREATE POLICY "All authenticated users can read templates"
  ON dispute_templates
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- RLS Policies for communications
CREATE POLICY "Users can read own communications"
  ON communications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clients 
      WHERE id = client_id AND (
        user_id = auth.uid() OR 
        assigned_specialist_id = auth.uid() OR
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
      )
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_specialist_id ON clients(assigned_specialist_id);
CREATE INDEX IF NOT EXISTS idx_credit_scores_client_id ON credit_scores(client_id);
CREATE INDEX IF NOT EXISTS idx_negative_items_client_id ON negative_items(client_id);
CREATE INDEX IF NOT EXISTS idx_documents_client_id ON documents(client_id);
CREATE INDEX IF NOT EXISTS idx_communications_client_id ON communications(client_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_negative_items_updated_at BEFORE UPDATE ON negative_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dispute_templates_updated_at BEFORE UPDATE ON dispute_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();