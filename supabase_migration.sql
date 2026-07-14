-- ==========================================
-- Supabase Database Migration for Washa App
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Products Table
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
    quantity INTEGER NOT NULL DEFAULT 0,
    min_alert INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Orders Table
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT,
    customer_phone TEXT,
    products TEXT[], -- List of product IDs (consider a junction table for complex apps)
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    payment_method TEXT NOT NULL,
    payment_status TEXT NOT NULL,
    order_status TEXT NOT NULL,
    source TEXT NOT NULL,
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    priority TEXT NOT NULL,
    added_to_sales BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Sales Table
CREATE TABLE public.sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    products TEXT[], -- List of product IDs
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    estimated_cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
    payment_method TEXT NOT NULL,
    source TEXT NOT NULL,
    customer_name TEXT,
    details TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Expenses Table
CREATE TABLE public.expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    category TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    payment_method TEXT NOT NULL,
    supplier TEXT,
    is_confirmed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    receipt TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Inventory Movements Table
CREATE TABLE public.inventory_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    direction TEXT NOT NULL, -- '➕' or '➖'
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    sale_id UUID REFERENCES public.sales(id) ON DELETE SET NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    handler TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Daily Reports Table
CREATE TABLE public.daily_reports (
    id TEXT PRIMARY KEY, -- Format: YYYY-MM-DD
    date TEXT NOT NULL,
    cash_sales NUMERIC(10, 2) NOT NULL DEFAULT 0,
    card_sales NUMERIC(10, 2) NOT NULL DEFAULT 0,
    transfer_sales NUMERIC(10, 2) NOT NULL DEFAULT 0,
    expenses NUMERIC(10, 2) NOT NULL DEFAULT 0,
    notes_problems TEXT,
    notes_inventory TEXT,
    notes_recommendations TEXT,
    is_closed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Daily Tasks Table
CREATE TABLE public.daily_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    stage TEXT NOT NULL,
    priority TEXT NOT NULL,
    status TEXT NOT NULL,
    handler TEXT,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. System Settings Table
-- Used to store global configuration (typically a single row)
CREATE TABLE public.system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_methods TEXT[] DEFAULT '{"كاش", "بطاقة", "مدى", "تحويل بنكي"}',
    order_statuses TEXT[] DEFAULT '{"جديد", "قيد التجهيز", "جاهز", "مكتمل", "ملغي"}',
    categories TEXT[] DEFAULT '{"تيشيرت", "سويت تيشيرت", "هودي", "بلوفر", "إكسسوارات", "أخرى"}',
    booth_name TEXT DEFAULT 'وشى',
    event_city TEXT DEFAULT 'الرياض',
    event_duration TEXT,
    cashier_name TEXT,
    admin_pin TEXT DEFAULT '0000',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all tables (Best Practice for Supabase)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Create default policies allowing authenticated users to read/write (Adjust according to your auth logic)
CREATE POLICY "Allow authenticated full access" ON public.products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access" ON public.orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access" ON public.sales FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access" ON public.expenses FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access" ON public.inventory_movements FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access" ON public.daily_reports FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access" ON public.daily_tasks FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access" ON public.system_settings FOR ALL USING (auth.role() = 'authenticated');
