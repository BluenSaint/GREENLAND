/*
  # Add Admin User for Authentication
  
  This migration adds the admin user to the auth.users table
  and links it to the users table in the public schema.
*/

-- Create admin user in auth.users
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  '00000000-0000-0000-0000-000000000000',
  'admin@creditfix.com',
  '$2a$10$Ej7lGJJGqGJGqGJGqGJGqOEj7lGJJGqGJGqGJGqGJGqGJGqGJGqGJG',
  now(),
  NULL,
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Admin User"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Create specialist user in auth.users
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '550e8400-e29b-41d4-a716-446655440002',
  '00000000-0000-0000-0000-000000000000',
  'specialist@creditfix.com',
  '$2a$10$Ej7lGJJGqGJGqGJGqGJGqOEj7lGJJGqGJGqGJGqGJGqGJGqGJGqGJG',
  now(),
  NULL,
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Specialist User"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Create client users in auth.users
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '550e8400-e29b-41d4-a716-446655440003',
  '00000000-0000-0000-0000-000000000000',
  'john.smith@email.com',
  '$2a$10$Ej7lGJJGqGJGqGJGqGJGqOEj7lGJJGqGJGqGJGqGJGqGJGqGJGqGJG',
  now(),
  NULL,
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "John Smith"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '550e8400-e29b-41d4-a716-446655440004',
  '00000000-0000-0000-0000-000000000000',
  'emily.rodriguez@email.com',
  '$2a$10$Ej7lGJJGqGJGqGJGqGJGqOEj7lGJJGqGJGqGJGqGJGqGJGqGJGqGJG',
  now(),
  NULL,
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Emily Rodriguez"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;