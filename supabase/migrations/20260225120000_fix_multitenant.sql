-- Fix: Remove tenant_id from users (violates single-account architecture)
-- Users are global; their purchases (enrollments/transactions) belong to tenants
ALTER TABLE public.users DROP COLUMN IF EXISTS tenant_id;

-- Fix: Correct split_percent default from 15% to 10%
ALTER TABLE public.tenants ALTER COLUMN split_percent SET DEFAULT 10.00;
UPDATE public.tenants SET split_percent = 10.00 WHERE split_percent = 15.00;
