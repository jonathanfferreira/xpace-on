-- Migration: 20260304000000_public_profiles.sql
-- Feature: Public user profiles with @username system

-- 1. Add username column to users table
ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
    ADD COLUMN IF NOT EXISTS bio TEXT,
    ADD COLUMN IF NOT EXISTS is_profile_public BOOLEAN DEFAULT true;

-- 2. Constraint: username format (lowercase, alphanumeric + underscore, 3-30 chars)
ALTER TABLE public.users
    ADD CONSTRAINT username_format CHECK (
        username IS NULL OR username ~ '^[a-z0-9_]{3,30}$'
    );

-- 3. Index for fast username lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);

-- Helper function to safely read the achievements array length from auth.users (requires security definer)
CREATE OR REPLACE FUNCTION public.get_achievements_count(user_id uuid)
RETURNS int AS $$
DECLARE
  amt int;
BEGIN
  -- We extract the array length of achievements_claimed from raw_user_meta_data
  SELECT jsonb_array_length(NULLIF(raw_user_meta_data->'achievements_claimed', 'null'::jsonb)) INTO amt 
  FROM auth.users WHERE id = user_id;
  RETURN COALESCE(amt, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE VIEW public.public_profiles AS
    SELECT
        u.id,
        u.username,
        u.full_name,
        u.avatar_url,
        u.bio,
        u.created_at,
        COALESCE(
            (SELECT SUM(xp_awarded) FROM public.progress WHERE user_id = u.id),
            0
        ) AS xp_total,
        public.get_achievements_count(u.id) AS achievements_count
    FROM public.users u
    WHERE u.is_profile_public = true
      AND u.username IS NOT NULL;

-- Grant select on the view to anon and authenticated roles
GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- 5. Function to auto-generate a unique username from full_name on first login
CREATE OR REPLACE FUNCTION public.generate_username(base_name TEXT)
RETURNS TEXT AS $$
DECLARE
    slug TEXT;
    candidate TEXT;
    counter INTEGER := 0;
BEGIN
    -- Sanitize: lowercase, replace spaces/special chars with underscore, remove invalid chars
    slug := lower(regexp_replace(base_name, '[^a-z0-9]', '_', 'g'));
    slug := regexp_replace(slug, '_+', '_', 'g'); -- collapse multiple underscores
    slug := trim(both '_' from slug);             -- remove leading/trailing underscores
    slug := left(slug, 28);                       -- max 28 so counter suffix fits

    IF length(slug) < 3 THEN
        slug := 'user_' || slug;
    END IF;

    candidate := slug;

    -- Find a unique candidate
    LOOP
        EXIT WHEN NOT EXISTS (SELECT 1 FROM public.users WHERE username = candidate);
        counter := counter + 1;
        candidate := slug || '_' || counter::TEXT;
    END LOOP;

    RETURN candidate;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Update the handle_new_user trigger to auto-assign a username
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    generated_username TEXT;
    base_name TEXT;
BEGIN
    -- Get name from metadata (Google OAuth sends 'full_name' or 'name')
    base_name := COALESCE(
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'name',
        split_part(new.email, '@', 1)
    );

    generated_username := public.generate_username(base_name);

    INSERT INTO public.users (id, email, full_name, avatar_url, role, username)
    VALUES (
        new.id,
        new.email,
        new.raw_user_meta_data->>'full_name',
        COALESCE(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture'),
        COALESCE(new.raw_user_meta_data->>'role', 'aluno'),
        generated_username
    )
    ON CONFLICT (id) DO NOTHING;

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
