-- XTORE Foundation (Marketplace API)
-- Tables for physical products, variants, and orders with full multitenant & RLS support.

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.xtore_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    images TEXT[] DEFAULT array[]::TEXT[],
    
    -- Logistic Data for Melhor Envio
    weight_kg NUMERIC(6, 3) NOT NULL DEFAULT 0.300,
    width_cm NUMERIC(5, 1) NOT NULL DEFAULT 20.0,
    height_cm NUMERIC(5, 1) NOT NULL DEFAULT 10.0,
    length_cm NUMERIC(5, 1) NOT NULL DEFAULT 20.0,
    
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_xtore_products_tenant ON public.xtore_products(tenant_id);

-- 2. ORDERS TABLE
CREATE TYPE shipping_status_enum AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');

CREATE TABLE IF NOT EXISTS public.xtore_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    
    -- Financials
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    discount_applied NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (discount_applied >= 0),
    xp_used INTEGER NOT NULL DEFAULT 0 CHECK (xp_used >= 0),
    shipping_cost NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (shipping_cost >= 0),
    
    -- Logistics Tracking
    status shipping_status_enum NOT NULL DEFAULT 'pending',
    tracking_code TEXT,
    shipping_address JSONB NOT NULL,
    asaas_payment_id TEXT, -- Link to Asaas Charge ID
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_xtore_orders_buyer ON public.xtore_orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_xtore_orders_tenant ON public.xtore_orders(tenant_id);

-- 3. ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.xtore_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.xtore_orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.xtore_products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_xtore_order_items_order ON public.xtore_order_items(order_id);

-- ROW LEVEL SECURITY (RLS)

-- A. PRODUCTS RLS
ALTER TABLE public.xtore_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products" 
    ON public.xtore_products FOR SELECT 
    USING (is_active = true OR auth.uid() IN (SELECT owner_id FROM public.tenants WHERE id = tenant_id));

CREATE POLICY "Tenants can insert their own products" 
    ON public.xtore_products FOR INSERT 
    WITH CHECK (auth.uid() IN (SELECT owner_id FROM public.tenants WHERE id = tenant_id));

CREATE POLICY "Tenants can update their own products" 
    ON public.xtore_products FOR UPDATE 
    USING (auth.uid() IN (SELECT owner_id FROM public.tenants WHERE id = tenant_id));

CREATE POLICY "Tenants can delete their own products" 
    ON public.xtore_products FOR DELETE 
    USING (auth.uid() IN (SELECT owner_id FROM public.tenants WHERE id = tenant_id));

-- B. ORDERS RLS
ALTER TABLE public.xtore_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers can view their own orders" 
    ON public.xtore_orders FOR SELECT 
    USING (auth.uid() = buyer_id);

CREATE POLICY "Tenants can view orders made to them" 
    ON public.xtore_orders FOR SELECT 
    USING (auth.uid() IN (SELECT owner_id FROM public.tenants WHERE id = tenant_id));

-- System typically creates orders via Service Role after Checkout/Payment intent,
-- But we'll allow buyer basic insert (payment logic still handled in backend securely)
CREATE POLICY "Buyers can create orders" 
    ON public.xtore_orders FOR INSERT 
    WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Tenants can update order statuses" 
    ON public.xtore_orders FOR UPDATE 
    USING (auth.uid() IN (SELECT owner_id FROM public.tenants WHERE id = tenant_id))
    WITH CHECK (auth.uid() IN (SELECT owner_id FROM public.tenants WHERE id = tenant_id));

-- C. ORDER ITEMS RLS
ALTER TABLE public.xtore_order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers can view their own order items" 
    ON public.xtore_order_items FOR SELECT 
    USING (order_id IN (SELECT id FROM public.xtore_orders WHERE buyer_id = auth.uid()));

CREATE POLICY "Tenants can view items from their orders" 
    ON public.xtore_order_items FOR SELECT 
    USING (order_id IN (SELECT id FROM public.xtore_orders WHERE tenant_id IN (SELECT id FROM public.tenants WHERE owner_id = auth.uid())));

CREATE POLICY "Buyers can insert order items" 
    ON public.xtore_order_items FOR INSERT 
    WITH CHECK (order_id IN (SELECT id FROM public.xtore_orders WHERE buyer_id = auth.uid()));

-- Realtime Features for XTORE Orders
alter publication supabase_realtime add table public.xtore_orders;
