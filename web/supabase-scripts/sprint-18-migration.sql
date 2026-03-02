-- ==============================================
-- Migration: Sprint 18 - Branding & Subcontas
-- ==============================================

-- 1. Modificar a tabela 'tenants' existente
ALTER TABLE tenants 
ADD COLUMN IF NOT EXISTS banner_url TEXT,
ADD COLUMN IF NOT EXISTS pix_key TEXT,
ADD COLUMN IF NOT EXISTS bank_code TEXT,
ADD COLUMN IF NOT EXISTS bank_agency TEXT,
ADD COLUMN IF NOT EXISTS bank_account TEXT;

-- 2. (Opcional) Criação da tabela asaas_wallets para logs estendidos
CREATE TABLE IF NOT EXISTS asaas_wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    asaas_customer_id TEXT, -- Se atuar como cliente tbm
    asaas_wallet_id TEXT NOT NULL, -- ID da Subconta
    company_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ativar RLS
ALTER TABLE asaas_wallets ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Apenas admins e o próprio tenant podem ver suas wallets"
ON asaas_wallets
FOR SELECT
USING ( auth.uid() IN (SELECT owner_id FROM tenants WHERE id = tenant_id) );
