-- Commerce Engine: Materials, Subscriptions, Pricing Types

CREATE TABLE IF NOT EXISTS public.course_materials (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
    title text NOT NULL,
    file_url text NOT NULL,
    file_type text DEFAULT 'pdf',
    file_size bigint DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id),
    tenant_id uuid REFERENCES public.tenants(id),
    asaas_subscription_id text,
    plan_name text NOT NULL,
    price numeric(10,2) NOT NULL,
    billing_cycle text DEFAULT 'MONTHLY',
    status text DEFAULT 'pending' CHECK (status IN ('active','cancelled','overdue','pending')),
    current_period_end timestamptz,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS pricing_type text DEFAULT 'one_time'
    CHECK (pricing_type IN ('one_time', 'subscription'));
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS min_price numeric(10,2) DEFAULT 39.90;

ALTER TABLE public.course_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published course materials" ON public.course_materials
    FOR SELECT USING (true);

CREATE POLICY "Course owners can manage materials" ON public.course_materials
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.courses c
        JOIN public.tenants t ON c.tenant_id = t.id
        WHERE c.id = course_materials.course_id AND t.owner_id = auth.uid()
    ));

CREATE POLICY "Users can read own subscriptions" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all subscriptions" ON public.subscriptions
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    ));
