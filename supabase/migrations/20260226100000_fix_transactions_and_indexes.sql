-- Migration: 20260226100000_fix_transactions_and_indexes.sql
-- Description: Fix transactions status constraint to include 'overdue' + add performance indexes

-- ==============================
-- 1. Fix transactions status constraint
-- The webhook sends 'overdue' for PAYMENT_OVERDUE events but the original
-- CHECK constraint only allowed: ('pending', 'confirmed', 'failed', 'refunded')
-- ==============================
ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS transactions_status_check;
ALTER TABLE public.transactions ADD CONSTRAINT transactions_status_check
    CHECK (status IN ('pending', 'confirmed', 'failed', 'refunded', 'overdue', 'mock'));

-- Also add the missing 'confirmed_at' column used by webhook
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS confirmed_at timestamptz;

-- Also add 'payment_method' column used by checkout (pix / credit)
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS payment_method text;

-- ==============================
-- 2. Performance indexes on high-traffic columns
-- ==============================

-- Webhook queries this on every payment notification
CREATE INDEX IF NOT EXISTS idx_transactions_asaas_id
    ON public.transactions(asaas_payment_id);

-- Dashboard and lesson page query progress by user
CREATE INDEX IF NOT EXISTS idx_progress_user_id
    ON public.progress(user_id);

-- Lesson views are aggregated for top 10 trending
CREATE INDEX IF NOT EXISTS idx_lesson_views_lesson_id
    ON public.lesson_views(lesson_id);

-- Dashboard enrollment query filters by user_id + status
CREATE INDEX IF NOT EXISTS idx_enrollments_user_status
    ON public.enrollments(user_id, status);

-- Comments are queried by lesson_id on every lesson load
CREATE INDEX IF NOT EXISTS idx_comments_lesson_id
    ON public.comments(lesson_id);
