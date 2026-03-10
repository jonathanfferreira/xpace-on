import { NextRequest, NextResponse } from 'next/server';

// Endpoint temporário de diagnóstico — remover após confirmar que Resend está funcionando
// Uso: GET /api/test-resend?secret=SEU_SECRET&to=seu@email.com
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    // Proteção simples por secret (adicione TEST_SECRET nas env vars do Vercel)
    const secret = searchParams.get('secret');
    if (!secret || secret !== process.env.TEST_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const to = searchParams.get('to');
    if (!to) {
        return NextResponse.json({ error: 'Missing ?to=email@exemplo.com' }, { status: 400 });
    }

    const results: Record<string, unknown> = {
        hasApiKey: !!process.env.RESEND_API_KEY,
        audienceId: process.env.RESEND_AUDIENCE_ID || '8cfa20f6-1adb-4921-9e48-5ee36453543c',
        keyPrefix: process.env.RESEND_API_KEY?.slice(0, 10) + '...',
    };

    if (!process.env.RESEND_API_KEY) {
        return NextResponse.json({ results, error: 'RESEND_API_KEY não configurada no Vercel' });
    }

    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    // 1. Listar audiences (valida se a key é válida e tem permissão)
    const { data: audiences, error: audErr } = await resend.audiences.list();
    results.audiences = audiences ?? null;
    results.audienceError = audErr ? { name: audErr.name, message: audErr.message } : null;

    // 2. Enviar e-mail de teste
    const { data: emailData, error: emailErr } = await resend.emails.send({
        from: 'XTAGE <contato@xtage.app>',
        to: [to],
        subject: '[TESTE] Resend configurado corretamente ✅',
        html: '<p style="font-family:sans-serif">Se você recebeu este e-mail, o Resend está funcionando corretamente no XTAGE! ✅</p>',
    });
    results.emailData = emailData ?? null;
    results.emailError = emailErr ? { name: emailErr.name, message: emailErr.message } : null;

    return NextResponse.json({ ok: !emailErr, results });
}
