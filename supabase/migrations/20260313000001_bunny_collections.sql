-- Migration: 20260313000001_bunny_collections.sql
-- Description: Adiciona bunny_collection_id para organizar os vídeos por Tenant e Curso no BunnyCDN.

BEGIN;

ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS bunny_collection_id text;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS bunny_collection_id text;

COMMIT;
