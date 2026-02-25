-- Migration: 20260225000000_bunny_video_status.sql
-- Description: Adiciona controle de estado (status) e duração para os vídeos renderizados pela Bunny.net

ALTER TABLE public.lessons 
ADD COLUMN IF NOT EXISTS status text check (status in ('draft', 'processing', 'published', 'failed')) default 'draft',
ADD COLUMN IF NOT EXISTS duration integer default 0; -- Duracao em segundos
