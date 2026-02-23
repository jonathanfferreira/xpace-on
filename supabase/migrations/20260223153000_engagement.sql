-- Migration: Sprint 6 - Engagement & Community

-- 1. XP Tracker
CREATE TABLE IF NOT EXISTS public.user_xp_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    amount INT NOT NULL,
    source TEXT NOT NULL, -- e.g., 'video_finished', 'streak_bonus', 'login'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Leaderboard Weekly View
CREATE OR REPLACE VIEW public.leaderboard_weekly AS
SELECT 
    u.id as user_id,
    u.full_name,
    u.avatar_url,
    COALESCE(SUM(x.amount), 0) as weekly_xp
FROM public.users u
LEFT JOIN public.user_xp_history x ON u.id = x.user_id AND x.created_at >= date_trunc('week', NOW())
GROUP BY u.id
ORDER BY weekly_xp DESC;

-- 3. Comments (Community Board / Fórum das Aulas)
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE, -- Permite Responder (Threads)
    content TEXT NOT NULL,
    likes INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE public.user_xp_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Policies for XP History
CREATE POLICY "Users can view their own XP history" 
    ON public.user_xp_history FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own XP" 
    ON public.user_xp_history FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Policies for Comments
CREATE POLICY "Everyone can view comments" 
    ON public.comments FOR SELECT 
    USING (true);

CREATE POLICY "Users can insert their own comments" 
    ON public.comments FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
    ON public.comments FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
    ON public.comments FOR DELETE 
    USING (auth.uid() = user_id);
