-- ============================================
-- NEO BRUTALISM GAME TOP UP - SCHEMA SUPABASE
-- ============================================

-- Enable RLS
ALTER DATABASE postgres SET "app.settings.jwt_secret" TO 'your-jwt-secret';

-- ============================================
-- 1. TABLE: games
-- ============================================
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  category VARCHAR(100) NOT NULL DEFAULT 'popular',
  is_active BOOLEAN DEFAULT true,
  requires_server_id BOOLEAN DEFAULT false,
  server_id_hint TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. TABLE: products
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  original_price INTEGER,
  nominal VARCHAR(100) NOT NULL,
  bonus TEXT,
  is_promo BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. TABLE: payment_methods
-- ============================================
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL,
  logo_url TEXT,
  fee INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. TABLE: transactions
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id VARCHAR(50) UNIQUE NOT NULL,
  game_id UUID REFERENCES games(id),
  product_id UUID REFERENCES products(id),
  user_id VARCHAR(255),
  server_id VARCHAR(255),
  username VARCHAR(255),
  price INTEGER NOT NULL,
  fee INTEGER DEFAULT 0,
  total INTEGER NOT NULL,
  payment_method VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending',
  payment_status VARCHAR(50) DEFAULT 'unpaid',
  qr_code TEXT,
  payment_url TEXT,
  paid_at TIMESTAMPTZ,
  expired_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. TABLE: promos
-- ============================================
CREATE TABLE IF NOT EXISTS promos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  discount_percent INTEGER,
  game_id UUID REFERENCES games(id),
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. TABLE: admins
-- ============================================
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE promos ENABLE ROW LEVEL SECURITY;

-- Games: Public read
CREATE POLICY "Games public read" ON games FOR SELECT USING (true);

-- Products: Public read (active only)
CREATE POLICY "Products public read" ON products FOR SELECT USING (is_active = true);

-- Payment Methods: Public read (active only)
CREATE POLICY "Payment methods public read" ON payment_methods FOR SELECT USING (is_active = true);

-- Transactions: Insert by anyone, read by invoice_id
CREATE POLICY "Transactions insert" ON transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Transactions read by invoice" ON transactions FOR SELECT USING (true);

-- Promos: Public read (active only)
CREATE POLICY "Promos public read" ON promos FOR SELECT USING (is_active = true);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_games_slug ON games(slug);
CREATE INDEX idx_games_category ON games(category);
CREATE INDEX idx_products_game_id ON products(game_id);
CREATE INDEX idx_transactions_invoice ON transactions(invoice_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_promos_active ON promos(is_active);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_games_updated_at BEFORE UPDATE ON games
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Generate Invoice ID
CREATE OR REPLACE FUNCTION generate_invoice_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.invoice_id = 'INV-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_invoice_id BEFORE INSERT ON transactions
  FOR EACH ROW EXECUTE FUNCTION generate_invoice_id();

-- ============================================
-- DUMMY DATA
-- ============================================

-- Games
INSERT INTO games (name, slug, description, image_url, category, requires_server_id, server_id_hint, sort_order) VALUES
('Mobile Legends', 'mobile-legends', 'Top up Diamond Mobile Legends murah dan cepat', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400', 'popular', true, 'Contoh: 1234', 1),
('Free Fire', 'free-fire', 'Top up Diamond Free Fire termurah', 'https://images.unsplash.com/photo-1552820728-8b83bb6b2b0a?w=400', 'popular', false, NULL, 2),
('PUBG Mobile', 'pubg-mobile', 'Top up UC PUBG Mobile', 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=400', 'popular', false, NULL, 3),
('Genshin Impact', 'genshin-impact', 'Top up Genesis Crystal', 'https://images.unsplash.com/photo-1612287230217-8c7c6c170b95?w=400', 'popular', true, 'Contoh: Asia', 4),
('Valorant', 'valorant', 'Top up VP Valorant', 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=400', 'popular', false, NULL, 5),
('Call of Duty Mobile', 'cod-mobile', 'Top up CP COD Mobile', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400', 'trending', false, NULL, 6),
('Honor of Kings', 'honor-of-kings', 'Top up Token Honor of Kings', 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400', 'trending', true, 'Contoh: 12345', 7),
('Apex Legends Mobile', 'apex-legends', 'Top up Syndicate Gold', 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400', 'new', false, NULL, 8);

-- Products for Mobile Legends
INSERT INTO products (game_id, name, description, price, original_price, nominal, bonus, is_promo, sort_order) VALUES
((SELECT id FROM games WHERE slug = 'mobile-legends'), '86 Diamond', '86 Diamond + 8 Bonus', 12500, 15000, '86', '8 Bonus', true, 1),
((SELECT id FROM games WHERE slug = 'mobile-legends'), '172 Diamond', '172 Diamond + 16 Bonus', 25000, 30000, '172', '16 Bonus', false, 2),
((SELECT id FROM games WHERE slug = 'mobile-legends'), '257 Diamond', '257 Diamond + 25 Bonus', 37500, 45000, '257', '25 Bonus', true, 3),
((SELECT id FROM games WHERE slug = 'mobile-legends'), '344 Diamond', '344 Diamond + 34 Bonus', 50000, 60000, '344', '34 Bonus', false, 4),
((SELECT id FROM games WHERE slug = 'mobile-legends'), '514 Diamond', '514 Diamond + 51 Bonus', 75000, 90000, '514', '51 Bonus', false, 5),
((SELECT id FROM games WHERE slug = 'mobile-legends'), '706 Diamond', '706 Diamond + 70 Bonus', 100000, 120000, '706', '70 Bonus', true, 6),
((SELECT id FROM games WHERE slug = 'mobile-legends'), '1402 Diamond', '1402 Diamond + 140 Bonus', 200000, 240000, '1402', '140 Bonus', false, 7);

-- Products for Free Fire
INSERT INTO products (game_id, name, description, price, original_price, nominal, bonus, is_promo, sort_order) VALUES
((SELECT id FROM games WHERE slug = 'free-fire'), '50 Diamond', '50 Diamond', 7000, 10000, '50', NULL, true, 1),
((SELECT id FROM games WHERE slug = 'free-fire'), '100 Diamond', '100 Diamond', 14000, 20000, '100', NULL, false, 2),
((SELECT id FROM games WHERE slug = 'free-fire'), '310 Diamond', '310 Diamond', 40000, 50000, '310', NULL, false, 3),
((SELECT id FROM games WHERE slug = 'free-fire'), '520 Diamond', '520 Diamond', 65000, 80000, '520', NULL, true, 4),
((SELECT id FROM games WHERE slug = 'free-fire'), '1060 Diamond', '1060 Diamond', 130000, 160000, '1060', NULL, false, 5);

-- Payment Methods
INSERT INTO payment_methods (name, code, type, fee, sort_order) VALUES
('QRIS', 'qris', 'ewallet', 0, 1),
('DANA', 'dana', 'ewallet', 0, 2),
('OVO', 'ovo', 'ewallet', 0, 3),
('GoPay', 'gopay', 'ewallet', 0, 4),
('Bank Transfer BCA', 'bca', 'bank', 4000, 5),
('Bank Transfer BNI', 'bni', 'bank', 4000, 6),
('Bank Transfer Mandiri', 'mandiri', 'bank', 4000, 7);

-- Promos
INSERT INTO promos (title, description, image_url, discount_percent, is_active, sort_order) VALUES
('Flash Sale Diamond ML', 'Diskon 20% untuk semua paket Diamond Mobile Legends', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800', 20, true, 1),
('Bonus Diamond Free Fire', 'Dapatkan bonus 10% diamond untuk setiap top up', 'https://images.unsplash.com/photo-1552820728-8b83bb6b2b0a?w=800', 10, true, 2),
('Weekend Special', 'Diskon khusus akhir pekan untuk semua game', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800', 15, true, 3);

-- Admin (password: admin123)
INSERT INTO admins (username, password_hash) VALUES
('admin', '$2a$10$YourHashedPasswordHere');

-- ============================================
-- REALTIME SETUP
-- ============================================
BEGIN;
  -- Drop the publication if it exists
  DROP PUBLICATION IF EXISTS supabase_realtime;
  -- Create the publication
  CREATE PUBLICATION supabase_realtime;
COMMIT;

-- Add tables to realtime
ALTER PUBLICATION supabase_realtime ADD TABLE transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE games;

-- Storage bucket for banners
INSERT INTO storage.buckets (id, name, public) VALUES ('banners', 'banners', true);
