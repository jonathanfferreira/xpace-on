import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, text, url } = body;

        webpush.setVapidDetails(
            'mailto:suporte@xpace.on',
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
            process.env.VAPID_PRIVATE_KEY!
        );

        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            { cookies: { getAll() { return cookieStore.getAll() }, setAll() { } } }
        );

        const { data: subs, error } = await supabase.from('push_subscriptions').select('*');
        if (error || !subs) throw new Error("Erro ao buscar subscriptions: " + error?.message);

        const payload = JSON.stringify({
            title: title || 'XPACE ON',
            body: text || 'Temos uma novidade para você!',
            url: url || '/'
        });

        const promises = subs.map(sub => {
            const pushConfig = {
                endpoint: sub.endpoint,
                keys: {
                    p256dh: sub.p256dh,
                    auth: sub.auth
                }
            };
            return webpush.sendNotification(pushConfig, payload).catch(e => {
                if (e.statusCode === 410 || e.statusCode === 404) {
                    supabase.from('push_subscriptions').delete().eq('id', sub.id).then();
                }
            });
        });

        await Promise.allSettled(promises);
        return NextResponse.json({ success: true, sentCount: subs.length });
    } catch (e: any) {
        console.error('Push Error:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
