-- Migration: Adicionar colunas de gerenciamento Multi-Tenant à tabela tenants
-- e ajustar RLS para permitir que alunos criem aplicações de parceria

ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS status text default 'pending' check (status in ('pending', 'active', 'suspended'));
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS instagram text;
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS video_url text;
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS asaas_wallet_id text;

-- RLS: qualquer autenticado pode criar sua própria aplicação
CREATE POLICY IF NOT EXISTS "Users can create their own tenant application" 
ON public.tenants FOR INSERT TO authenticated
WITH CHECK (auth.uid() = owner_id);

-- RLS: admins gerenciam tudo
CREATE POLICY IF NOT EXISTS "Admins can manage all tenants" 
ON public.tenants FOR ALL
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
