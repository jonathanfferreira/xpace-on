import { StudioLayoutWrapper } from "@/components/studio/studio-layout-wrapper";
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NotificationBell } from '@/components/layout/notification-bell';

async function getStudioUser() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll: () => cookieStore.getAll() } }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase
        .from('users')
        .select('full_name, role')
        .eq('id', user.id)
        .single();
    return data;
}

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
    const studioUser = await getStudioUser();

    return (
        <StudioLayoutWrapper studioUser={studioUser}>
            {children}
        </StudioLayoutWrapper>
    );
}
