-- Migration: 20260306110000_add_whatsapp_to_tenants.sql
-- Description: Adiciona coluna whatsapp à tabela tenants para o formulário de parceria
-- Fix: a coluna estava sendo inserida via /api/partner/apply mas não existia no schema

ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS whatsapp text;
