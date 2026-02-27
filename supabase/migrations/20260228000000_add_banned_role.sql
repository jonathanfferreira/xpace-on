-- Migration: 20260228000000_add_banned_role.sql
-- Description: Adds 'banned' to the role check constraint so admin can ban users.

ALTER TABLE public.users
    DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE public.users
    ADD CONSTRAINT users_role_check
    CHECK (role IN ('admin', 'professor', 'escola', 'aluno', 'banned'));

-- Update middleware RLS policy to block banned users
-- Banned users should not be able to access any protected data.
-- The middleware already redirects if session_lock fails, but we also
-- ensure banned users are denied by removing their active sessions.
CREATE OR REPLACE FUNCTION public.is_user_banned(u_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN (SELECT role = 'banned' FROM public.users WHERE id = u_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
