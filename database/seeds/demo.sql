-- Seed data for development and demo purposes
-- Passwords are all: Demo#2024

-- Keep gold prices for the dashboard to show a price per gram
INSERT INTO gold_prices (price_date, price_per_gram_eur, source) VALUES
  (CURRENT_DATE - 90, 58.42, 'London Bullion Market'),
  (CURRENT_DATE - 60, 59.15, 'London Bullion Market'),
  (CURRENT_DATE - 30, 60.23, 'London Bullion Market'),
  (CURRENT_DATE,      61.50, 'London Bullion Market');

-- Keep investors but remove their holdings and transactions
INSERT INTO investors (id, email, password_hash, first_name, last_name, entity_type, country_code, jurisdiction, kyc_status, role, email_verified) VALUES
  ('11111111-1111-1111-1111-111111111111','jean.dupont@familyoffice.fr',  '$2b$12$7n7otQDd6FczFgLdSampleHash1','Jean',   'Dupont',  'family_office','FR','France',      'approved','investor',true),
  ('22222222-2222-2222-2222-222222222222','maria.silva@esgfund.pt',       '$2b$12$7n7otQDd6FczFgLdSampleHash2','Maria',  'Silva',   'esg_fund',     'PT','Portugal',    'approved','investor',true),
  ('33333333-3333-3333-3333-333333333333','hans.mueller@institution.de',  '$2b$12$7n7otQDd6FczFgLdSampleHash3','Hans',   'Müller',  'institution',  'DE','Germany',     'approved','investor',true),
  ('44444444-4444-4444-4444-444444444444','sophie.martin@private.ch',     '$2b$12$7n7otQDd6FczFgLdSampleHash4','Sophie', 'Martin',  'individual',   'CH','Switzerland', 'approved','investor',true),
  ('99999999-9999-9999-9999-999999999999','admin@rebijoux.com',           '$2b$12$7n7otQDd6FczFgLdSampleHash5','Admin',  'Rebijoux','institution',  'PT','Portugal',    'approved','admin',   true);

INSERT INTO wallets (id, investor_id, xrpl_address, wallet_label) VALUES
  ('a1111111-1111-1111-1111-111111111111','11111111-1111-1111-1111-111111111111','rN7n7otQDd6FczFgLdSampleAddress1','Primary Custody Wallet'),
  ('a2222222-2222-2222-2222-222222222222','22222222-2222-2222-2222-222222222222','rN7n7otQDd6FczFgLdSampleAddress2','ESG Fund Main Wallet'),
  ('a3333333-3333-3333-3333-333333333333','33333333-3333-3333-3333-333333333333','rN7n7otQDd6FczFgLdSampleAddress3','Institutional Vault'),
  ('a4444444-4444-4444-4444-444444444444','44444444-4444-4444-4444-444444444444','rN7n7otQDd6FczFgLdSampleAddress4','Private Banking Wallet');

-- Initialize all holdings at zero
INSERT INTO holdings (investor_id, wallet_id, token_balance, gold_grams) VALUES
  ('11111111-1111-1111-1111-111111111111','a1111111-1111-1111-1111-111111111111',0,0),
  ('22222222-2222-2222-2222-222222222222','a2222222-2222-2222-2222-222222222222',0,0),
  ('33333333-3333-3333-3333-333333333333','a3333333-3333-3333-3333-333333333333',0,0),
  ('44444444-4444-4444-4444-444444444444','a4444444-4444-4444-4444-444444444444',0,0);

-- Initialize ESG metadata at zero
INSERT INTO esg_metadata (investor_id, total_recycled_gold_grams, forest_saved_hectares, mercury_avoided_kg, soil_erosion_avoided_m3, environmental_cost_saved_eur, sustainability_score, last_calculated) VALUES
  ('11111111-1111-1111-1111-111111111111', 0, 0, 0, 0, 0, 0, NOW()),
  ('22222222-2222-2222-2222-222222222222', 0, 0, 0, 0, 0, 0, NOW()),
  ('33333333-3333-3333-3333-333333333333', 0, 0, 0, 0, 0, 0, NOW()),
  ('44444444-4444-4444-4444-444444444444', 0, 0, 0, 0, 0, 0, NOW());
