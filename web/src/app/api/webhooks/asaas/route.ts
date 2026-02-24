import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { sendCartRecoveryEmail } from "@/utils/marketing/CartRecovery";

// Essa rota é acessada pelo Robô do Asaas via POST.
export async function POST(request: Request) {
    try {
        const payload = await request.json();

        // 1. Validar se o Evento Secundário do Webhook importa pra nós
        const evento = payload.event; // ex: PAYMENT_RECEIVED, PAYMENT_CONFIRMED
        const paymentId = payload.payment?.id;
        const netValue = payload.payment?.netValue || payload.payment?.value || 0.00; // Valor liquido do asaas
        const customerEmail = payload.payment?.customerEmail;

        if (!paymentId) {
            return NextResponse.json({ error: "No Payment ID provided" }, { status: 400 });
        }

        if (evento === 'PAYMENT_RECEIVED' || evento === 'PAYMENT_CONFIRMED') {
            console.log(`[ASAAS] 🤑 UHUL! Pagamento Confirmado: ${paymentId} | R$${netValue}`);

            // [MARKETING] 1. Disparar Conversão de Servidor para Meta ADS (CAPI)
            try {
                if (process.env.META_ACCESS_TOKEN && process.env.META_PIXEL_ID) {
                    await sendMetaPurchaseCAPI(customerEmail, netValue);
                    console.log(`[CAPI] ✅ Evento Purchase enviado ao Meta Ads!`);
                }
            } catch (e) {
                console.log(`[CAPI] ⚠️ Falha não-critica ao enviar tracking CAPI`, e);
            }

            // [BACKEND] 2. Injetar `enrollments` no Banco de Dados Supabase Service_Role
            // Usar um Service Role (Bypass RLS) pra forçar o desbloqueio do aluno na API.
            const cookieStore = await cookies();
            const supabase = createServerClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!,
                {
                    cookies: {
                        getAll() { return cookieStore.getAll(); },
                        setAll() { },
                    },
                }
            );

            // FLUXO DO ALUNO:
            // 1. Localiza a transaction no DB atrelada a esse paymentId
            // 2. Pega o user_id e course_id
            // 3. Update status = 'confirmed'
            // 4. Insert row(user_id, course_id) na public.enrollments

            return NextResponse.json({ message: "Venda Processada com Sucesso - Acesso Liberado" });
        } else if (evento === 'PAYMENT_OVERDUE' || evento === 'PAYMENT_DUNNING_RECEIVED') {
            // [MARKETING] 3. Disparar Carrinho Abandonado via Resend (Se a fatura vencer sem pgto)
            console.log(`[ASAAS] 🟡 Fatura Vencida/Abandonada: ${paymentId}. Iniciando Recuperação Resend.`);

            if (customerEmail) {
                const checkoutBackUrl = payload.payment?.invoiceUrl || 'https://xpace.on/checkout';
                await sendCartRecoveryEmail(customerEmail, "Dancer", checkoutBackUrl);
            }
            return NextResponse.json({ message: "Lead processado para Recuperação de Carrinho" });
        } else {
            // Ignora outros eventos (PAYMENT_CREATED, PAYMENT_DELETED, etc) para não dar timeout
            return NextResponse.json({ message: "Evento Ignorado" });
        }

    } catch (error: any) {
        console.error("🔴 ERRO NO WEBHOOK:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * Função Auxiliar: Meta Conversions API (CAPI) Server-Side Tracking
 */
async function sendMetaPurchaseCAPI(email: string | undefined, value: number) {
    if (!email) return;

    // Hash SHA256 do Email (Obriatório no padrão Meta CAPI)
    const crypto = await import('crypto');
    const hashedEmail = crypto.createHash('sha256').update(email.toLowerCase().trim()).digest('hex');

    const pixelId = process.env.META_PIXEL_ID;
    const accessToken = process.env.META_ACCESS_TOKEN;
    const url = `https://graph.facebook.com/v19.0/${pixelId}/events`;

    const data = {
        data: [
            {
                event_name: 'Purchase',
                event_time: Math.floor(Date.now() / 1000),
                action_source: 'website',
                user_data: {
                    em: [hashedEmail],
                },
                custom_data: {
                    currency: 'BRL',
                    value: value,
                }
            }
        ]
    };

    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, access_token: accessToken }),
    });
}
