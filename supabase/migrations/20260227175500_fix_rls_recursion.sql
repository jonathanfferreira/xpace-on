-- Migration: 20260227175500_fix_rls_recursion.sql
-- Description: Fixes "infinite recursion detected in policy for relation users" 
-- by using a security definer function to check roles.

-- 1. Create a security definer function to safely fetch the role
-- This function runs with the privileges of the creator (postgres/admin),
-- bypassing RLS checks on the users table and breaking the recursion.
CREATE OR REPLACE FUNCTION public.get_user_role(u_id uuid)
RETURNS text AS $$
BEGIN
  RETURN (SELECT role FROM public.users WHERE id = u_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop existing recursive policies to avoid conflicts
DROP POLICY IF EXISTS "Admins can read all users" ON public.users;
DROP POLICY IF EXISTS "Admins can manage all tenants" ON public.tenants;

-- 3. Re-create policies using the safe function
CREATE POLICY "Admins can read all users" ON public.users FOR SELECT
USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can manage all tenants" ON public.tenants FOR ALL
USING (public.get_user_role(auth.uid()) = 'admin');

-- 4. Fix other tables that might be using the same recursive logic
-- Subscriptions (from commerce_engine.sql)
DROP POLICY IF EXISTS "Admins can manage all subscriptions" ON public.subscriptions;
CREATE POLICY "Admins can manage all subscriptions" ON public.subscriptions FOR ALL
USING (public.get_user_role(auth.uid()) = 'admin');
