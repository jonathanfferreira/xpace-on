-- Migration: 20260226000000_multitenant_tenant_upgrades.sql
-- Description: Adiciona status de aprovação, carteira virtual do Asaas e split na tabela Tenants (Escolas)

ALTER TABLE public.tenants
ADD COLUMN IF NOT EXISTS status text check (status in ('pending', 'active', 'suspended')) default 'pending',
ADD COLUMN IF NOT EXISTS asaas_wallet_id text,
ADD COLUMN IF NOT EXISTS split_percent numeric(5,2) default 15.00; -- XPACE Fee on sales

-- Adds tenant_id to users to allow school isolation for specific students
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS tenant_id uuid references public.tenants(id);
