-- ====================================================================
-- THE VOULT PRESTIGE - SUPABASE DATABASE SCHEMA & INITIAL SEED DATA
-- High-End Luxury Apparel & Streetwear Store
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CATEGORIES TABLE (categorías)
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY DEFAULT 'cat-' || UPPER(SUBSTRING(gen_random_uuid()::text FROM 1 FOR 8)),
  nombre VARCHAR(255) NOT NULL,
  slug VARCHAR(255),
  orden INT DEFAULT 1,
  creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS TABLE (productosweb)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY DEFAULT 'tvp-' || gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  precio NUMERIC(12, 2) NOT NULL,
  url_imagen TEXT,
  imagenes JSONB DEFAULT '[]'::jsonb,
  tallas JSONB DEFAULT '{"XS": true, "S": true, "M": true, "L": true, "XL": true, "2XL": true}'::jsonb,
  stock JSONB DEFAULT '{"XS": 10, "S": 10, "M": 10, "L": 10, "XL": 10, "2XL": 10}'::jsonb,
  detalles JSONB DEFAULT '{"descripcion": "Edición de archivo con confección artesanal de alta costura.", "material": "100% Algodón Pesado de Grado Profesional (500 GSM)", "cuidados": "Lavar a mano con agua fría, secar a la sombra."}'::jsonb,
  categoria VARCHAR(100) DEFAULT 'T-Shirts / Camisetas',
  es_destacado BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDERS TABLE (pedidos)
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY DEFAULT 'ORDER-' || UPPER(SUBSTRING(gen_random_uuid()::text FROM 1 FOR 8)),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  cliente_nombre VARCHAR(255) NOT NULL,
  cliente_email VARCHAR(255),
  cliente_telefono VARCHAR(50) NOT NULL,
  cliente_direccion TEXT NOT NULL,
  cliente_ciudad VARCHAR(100) NOT NULL,
  items JSONB NOT NULL,
  total NUMERIC(12, 2) NOT NULL,
  estado VARCHAR(50) DEFAULT 'Pendiente',
  metodo_pago VARCHAR(50) DEFAULT 'MercadoPago / WhatsApp',
  notas TEXT
);

-- 5. COUPONS TABLE (cupones)
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo VARCHAR(50) UNIQUE NOT NULL,
  descuento NUMERIC(5, 2) NOT NULL,
  tipo VARCHAR(20) DEFAULT 'porcentaje', -- 'porcentaje' o 'fijo'
  activo BOOLEAN DEFAULT true,
  creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public categories access" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public products access" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public coupons select" ON public.coupons FOR SELECT USING (true);

-- Allow full access for management
CREATE POLICY "Admin full access categories" ON public.categories FOR ALL USING (true);
CREATE POLICY "Admin full access products" ON public.products FOR ALL USING (true);
CREATE POLICY "Admin full access orders" ON public.orders FOR ALL USING (true);
CREATE POLICY "Admin full access coupons" ON public.coupons FOR ALL USING (true);

-- 7. STORAGE BUCKET FOR PRODUCT IMAGES
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Product Images Read" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'product-images');

CREATE POLICY "Public Product Images Insert" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'product-images');

-- 8. SEED CATEGORIES
INSERT INTO public.categories (id, nombre, slug, orden) VALUES
('cat-1', 'T-Shirts / Camisetas', 't-shirts', 1),
('cat-2', 'Hoodies & Sweatshirts', 'hoodies', 2),
('cat-3', 'Jackets & Outerwear / Chaquetas', 'jackets', 3),
('cat-4', 'Sets & Tracksuits / Conjuntos', 'sets', 4)
ON CONFLICT (id) DO NOTHING;

-- 9. INITIAL SEED DATA FOR THE VOULT PRESTIGE
INSERT INTO public.products (id, nombre, precio, url_imagen, imagenes, tallas, stock, detalles, categoria, es_destacado) VALUES
(
  'TVP-001',
  'Balenciaga Crest Heavyweight Hoodie',
  380000,
  'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
  '["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80", "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1000&q=80"]',
  '{"XS": true, "S": true, "M": true, "L": true, "XL": true, "2XL": true}',
  '{"XS": 5, "S": 8, "M": 12, "L": 10, "XL": 6, "2XL": 4}',
  '{"descripcion": "Confeccionado en algodón peinado de 500 GSM con silueta oversized de alta costura, bordado frontal metálico y acabados artesanales de archivo.", "material": "100% French Terry Cotton (500 GSM)", "cuidados": "Lavar en seco o agua fría al revés."}',
  'Hoodies & Sweatshirts',
  true
),
(
  'TVP-002',
  'Chrome Hearts Horseshoe Logo Tee',
  240000,
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
  '["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80", "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80"]',
  '{"XS": false, "S": true, "M": true, "L": true, "XL": true, "2XL": false}',
  '{"XS": 0, "S": 6, "M": 10, "L": 8, "XL": 5, "2XL": 0}',
  '{"descripcion": "Camiseta de corte relajado con serigrafía de alta densidad en relieve y detalles característicos de archivo en mangas y espalda.", "material": "100% Organic Heavy Cotton (280 GSM)", "cuidados": "Lavado delicado en frío."}',
  'T-Shirts / Camisetas',
  true
)
ON CONFLICT (id) DO NOTHING;

-- SEED COUPONS
INSERT INTO public.coupons (codigo, descuento, tipo, activo) 
VALUES ('VAULT10', 10, 'porcentaje', true), ('PRESTIGE15', 15, 'porcentaje', true)
ON CONFLICT (codigo) DO NOTHING;
