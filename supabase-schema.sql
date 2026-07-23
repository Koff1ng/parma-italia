-- ====================================================================
-- THE VAULT PRESTIGE - SUPABASE DATABASE SCHEMA & INITIAL SEED DATA
-- High-End 1.1 Luxury Apparel & Streetwear Store
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PRODUCTS TABLE (productosweb)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY DEFAULT 'tvp-' || gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  precio NUMERIC(12, 2) NOT NULL,
  url_imagen TEXT,
  imagenes JSONB DEFAULT '[]'::jsonb,
  tallas JSONB DEFAULT '{"XS": true, "S": true, "M": true, "L": true, "XL": true, "2XL": true}'::jsonb,
  stock JSONB DEFAULT '{"XS": 10, "S": 10, "M": 10, "L": 10, "XL": 10, "2XL": 10}'::jsonb,
  detalles JSONB DEFAULT '{"descripcion": "Edición limitada 1:1 con materiales importados de primera calidad, bordados de alta precisión y empaque oficial de la casa de moda.", "material": "100% Algodón Pesado de Grado Profesional (450 GSM)", "cuidados": "Lavar a mano con agua fría, no usar blanqueador, secar a la sombra."}'::jsonb,
  categoria VARCHAR(100) DEFAULT 'Streetwear 1.1',
  es_destacado BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ORDERS TABLE (pedidos)
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

-- 4. COUPONS TABLE (cupones)
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo VARCHAR(50) UNIQUE NOT NULL,
  descuento NUMERIC(5, 2) NOT NULL,
  tipo VARCHAR(20) DEFAULT 'porcentaje', -- 'porcentaje' o 'fijo'
  activo BOOLEAN DEFAULT true,
  creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- 5. INVOICES TABLE (facturas)
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero_factura VARCHAR(100) UNIQUE NOT NULL,
  order_id TEXT REFERENCES public.orders(id) ON DELETE SET NULL,
  cliente_nombre VARCHAR(255) NOT NULL,
  cliente_documento VARCHAR(50),
  cliente_email VARCHAR(255),
  total NUMERIC(12, 2) NOT NULL,
  fecha TIMESTAMPTZ DEFAULT NOW(),
  estado VARCHAR(50) DEFAULT 'Emitida',
  pdf_url TEXT
);

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products & active coupons
CREATE POLICY "Public products access" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public coupons select" ON public.coupons FOR SELECT USING (true);

-- Allow authenticated admins full control (or default open policy for easy management)
CREATE POLICY "Admin full access products" ON public.products FOR ALL USING (true);
CREATE POLICY "Admin full access orders" ON public.orders FOR ALL USING (true);
CREATE POLICY "Admin full access coupons" ON public.coupons FOR ALL USING (true);
CREATE POLICY "Admin full access invoices" ON public.invoices FOR ALL USING (true);

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

-- 8. INITIAL SEED DATA FOR THE VAULT PRESTIGE (Ropa 1:1 Luxury Streetwear)
INSERT INTO public.products (id, nombre, precio, url_imagen, imagenes, tallas, stock, detalles, categoria, es_destacado) VALUES
(
  'TVP-001',
  'Hoodie Balenciaga Oversized Crest 1:1 Gold Edition',
  380000,
  'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
  '["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80", "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1000&q=80"]',
  '{"XS": true, "S": true, "M": true, "L": true, "XL": true, "2XL": true}',
  '{"XS": 5, "S": 8, "M": 12, "L": 10, "XL": 6, "2XL": 4}',
  '{"descripcion": "Hoodie Balenciaga calidad 1:1 idéntica a la versión retail. Confeccionada en franela pesada de 500g, bordado frontal en hilo metalizado y etiquetas de lavado auténticas con código QR escaneable.", "material": "100% Algodón Francés Peinado (500 GSM)", "cuidados": "Lavar al revés con agua fría, no planchar directamente el bordado."}',
  'Hoodies 1.1',
  true
),
(
  'TVP-002',
  'Camiseta Chrome Hearts Horseshoe Logo 1:1 Black',
  240000,
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
  '["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80", "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80"]',
  '{"XS": false, "S": true, "M": true, "L": true, "XL": true, "2XL": false}',
  '{"XS": 0, "S": 6, "M": 10, "L": 8, "XL": 5, "2XL": 0}',
  '{"descripcion": "Camiseta Chrome Hearts edición 1:1 con serigrafía en relieve de alta densidad en espalda y mangas. Incluye marquilla de cuello personalizada de la firma y bolsa anti-polvo.", "material": "100% Algodón Premium Heavyweight (280 GSM)", "cuidados": "Lavar en ciclo delicado, no usar secadora."}',
  'Camisetas 1.1',
  true
),
(
  'TVP-003',
  'Chaqueta Louis Vuitton Monogram Vault Puffer 1:1',
  750000,
  'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1000&q=80',
  '["https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1000&q=80", "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80"]',
  '{"XS": false, "S": true, "M": true, "L": true, "XL": true, "2XL": true}',
  '{"XS": 0, "S": 3, "M": 5, "L": 4, "XL": 2, "2XL": 1}',
  '{"descripcion": "Chaqueta acolchada Louis Vuitton Monogram 1.1. Acabado impermeable termosellado, herrajes grabados en bronce envejecido y plumón térmico de ganso para máximo aislamiento.", "material": "Poliamida técnica impermeable & Relleno térmico ultra-liviano", "cuidados": "Lavado en seco profesional exclusivamente."}',
  'Chaquetas & abrigos 1.1',
  true
),
(
  'TVP-004',
  'Conjunto Trapstar Shooters Tracksuit 1:1 Black/Gold',
  460000,
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
  '["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80", "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80"]',
  '{"XS": true, "S": true, "M": true, "L": true, "XL": true, "2XL": false}',
  '{"XS": 4, "S": 7, "M": 9, "L": 6, "XL": 3, "2XL": 0}',
  '{"descripcion": "Sudadera y pantaloneta Trapstar London edición 1.1 con letras de toalla en relieve Chenille y detalles dorados refractivos. Ajuste fino de corte urbano.", "material": "Mezcla de Algodón Cepillado & Poliéster de Alta Resistencia (400 GSM)", "cuidados": "Lavar a máquina en programa frío con prendas del mismo color."}',
  'Conjuntos 1.1',
  true
),
(
  'TVP-005',
  'Camiseta Gucci Blade Logo Oversized Tee 1:1 White',
  250000,
  'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80',
  '["https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80", "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80"]',
  '{"XS": true, "S": true, "M": true, "L": true, "XL": true, "2XL": true}',
  '{"XS": 3, "S": 6, "M": 10, "L": 8, "XL": 4, "2XL": 2}',
  '{"descripcion": "Camiseta Gucci Blade print calidad 1:1. Algodón orgánico suave de tacto sedoso con estampado en tinta plastisol importada.", "material": "100% Algodón Orgánico Italiano", "cuidados": "No retorcer, secar colgado a la sombra."}',
  'Camisetas 1.1',
  false
)
ON CONFLICT (id) DO NOTHING;

-- SEED COUPONS
INSERT INTO public.coupons (codigo, descuento, tipo, activo) 
VALUES ('VAULT10', 10, 'porcentaje', true), ('PRESTIGE15', 15, 'porcentaje', true)
ON CONFLICT (codigo) DO NOTHING;
