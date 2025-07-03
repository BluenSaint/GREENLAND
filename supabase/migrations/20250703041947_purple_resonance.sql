/*
  # Seed Data for Credit Repair Platform

  1. Sample Users
    - Admin user
    - Specialist users
    - Client users

  2. Sample Data
    - Dispute templates
    - Sample client data
    - Credit scores
    - Negative items
*/

-- Insert sample users
INSERT INTO users (id, email, role, first_name, last_name, is_active) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'admin@creditfix.com', 'admin', 'Sarah', 'Johnson', true),
  ('550e8400-e29b-41d4-a716-446655440002', 'specialist@creditfix.com', 'specialist', 'Michael', 'Davis', true),
  ('550e8400-e29b-41d4-a716-446655440003', 'john.smith@email.com', 'client', 'John', 'Smith', true),
  ('550e8400-e29b-41d4-a716-446655440004', 'emily.rodriguez@email.com', 'client', 'Emily', 'Rodriguez', true)
ON CONFLICT (id) DO NOTHING;

-- Insert dispute templates
INSERT INTO dispute_templates (id, name, category, description, template_content) VALUES
  ('550e8400-e29b-41d4-a716-446655440101', 'Not My Account', 'Account Ownership', 'Use when the account does not belong to the client', 'Dear Credit Bureau,

I am writing to dispute the following item on my credit report:

Creditor: {creditor}
Account Number: {account}
Date Reported: {dateReported}

This account does not belong to me. I have never had an account with this creditor, nor have I authorized anyone to open an account in my name. I am requesting that this item be removed from my credit report immediately.

Please investigate this matter and provide me with the results of your investigation within 30 days as required by the Fair Credit Reporting Act.

Sincerely,
{clientName}
{clientAddress}
{clientPhone}

Enclosures: Copy of ID, Proof of Address'),
  ('550e8400-e29b-41d4-a716-446655440102', 'Paid in Full', 'Payment Status', 'Use when the account has been paid but still shows as delinquent', 'Dear Credit Bureau,

I am writing to dispute the following item on my credit report:

Creditor: {creditor}
Account Number: {account}
Date Reported: {dateReported}

This account has been paid in full as of {paymentDate}. The current status shown on my credit report is inaccurate and does not reflect the true status of this account. I am requesting that this item be updated to reflect the correct ''Paid'' status or removed entirely if the creditor cannot verify the accuracy.

Please investigate this matter and provide me with the results of your investigation within 30 days as required by the Fair Credit Reporting Act.

Sincerely,
{clientName}
{clientAddress}
{clientPhone}

Enclosures: Proof of Payment, Copy of ID')
ON CONFLICT (id) DO NOTHING;

-- Insert sample clients
INSERT INTO clients (id, user_id, case_number, status, assigned_specialist_id, start_date, package_type, monthly_fee, contract_signed, contract_signed_date, personal_info) VALUES
  ('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440003', 'CR-2024-001', 'active', '550e8400-e29b-41d4-a716-446655440002', '2024-03-15', 'Premium', 99.99, true, '2024-03-15T10:30:00Z', '{"firstName": "John", "lastName": "Smith", "email": "john.smith@email.com", "phone": "(555) 123-4567", "dateOfBirth": "1985-03-15", "ssn": "***-**-1234", "address": {"street": "123 Main Street", "city": "Austin", "state": "TX", "zipCode": "78701"}}'),
  ('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440004', 'CR-2024-002', 'active', '550e8400-e29b-41d4-a716-446655440002', '2024-04-01', 'Standard', 79.99, true, '2024-04-01T14:20:00Z', '{"firstName": "Emily", "lastName": "Rodriguez", "email": "emily.rodriguez@email.com", "phone": "(555) 987-6543", "dateOfBirth": "1990-07-22", "ssn": "***-**-5678", "address": {"street": "456 Oak Avenue", "city": "Dallas", "state": "TX", "zipCode": "75201"}}')
ON CONFLICT (id) DO NOTHING;

-- Insert sample credit scores
INSERT INTO credit_scores (client_id, equifax, experian, transunion, average, score_date) VALUES
  ('550e8400-e29b-41d4-a716-446655440201', 589, 591, 587, 589, '2024-03-15'),
  ('550e8400-e29b-41d4-a716-446655440201', 598, 595, 601, 598, '2024-04-15'),
  ('550e8400-e29b-41d4-a716-446655440201', 612, 608, 615, 612, '2024-05-15'),
  ('550e8400-e29b-41d4-a716-446655440201', 625, 622, 628, 625, '2024-06-15'),
  ('550e8400-e29b-41d4-a716-446655440201', 635, 632, 638, 635, '2025-01-15'),
  ('550e8400-e29b-41d4-a716-446655440201', 642, 638, 645, 642, '2025-06-20'),
  ('550e8400-e29b-41d4-a716-446655440202', 622, 618, 625, 622, '2024-04-01'),
  ('550e8400-e29b-41d4-a716-446655440202', 635, 631, 638, 635, '2024-05-01'),
  ('550e8400-e29b-41d4-a716-446655440202', 648, 645, 651, 648, '2024-06-01'),
  ('550e8400-e29b-41d4-a716-446655440202', 662, 658, 665, 662, '2024-07-01'),
  ('550e8400-e29b-41d4-a716-446655440202', 685, 682, 688, 685, '2025-01-01'),
  ('550e8400-e29b-41d4-a716-446655440202', 698, 702, 695, 698, '2025-06-20')
ON CONFLICT DO NOTHING;

-- Insert sample negative items
INSERT INTO negative_items (client_id, type, creditor, account, amount, status, bureau, dispute_reason, date_reported, date_removed, last_disputed) VALUES
  ('550e8400-e29b-41d4-a716-446655440201', 'Late Payment', 'Capital One', '****1234', 2500, 'removed', 'all', 'Not my account', '2023-08-15', '2024-04-20', null),
  ('550e8400-e29b-41d4-a716-446655440201', 'Collection', 'ABC Collection Agency', 'COL78901', 850, 'in_progress', 'experian', 'Paid in full', '2023-12-01', null, '2025-05-15'),
  ('550e8400-e29b-41d4-a716-446655440202', 'Charge-off', 'Chase Bank', '****5678', 3200, 'removed', 'all', 'Account closed by consumer', '2023-06-10', '2024-06-15', null)
ON CONFLICT DO NOTHING;