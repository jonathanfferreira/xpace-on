import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Essa rota é acessada pelo Robô do Asaas via POST.
export async function POST(request: Request) {
    try {
        const payload = await request.json();

        // 1. Validar se o Evento Secundário do Webhook importa pra nós
        const evento = payload.event; // ex: PAYMENT_RECEIVED, PAYMENT_CONFIRMED
        const paymentId = payload.payment?.id;

        if (!paymentId) {
            return NextResponse.json({ error: "No Payment ID provided" }, { status: 400 });
        }

        if (evento === 'PAYMENT_RECEIVED' || evento === 'PAYMENT_CONFIRMED') {
            console.log(`🤑 UHUL! Pagamento Confirmado no Webhook: ${paymentId}`);

            // TODO: Injetar `enrollments` no Banco de Dados Supabase Service_Role
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
        } else {
            // Ignora outros eventos (PAYMENT_CREATED, PAYMENT_DELETED, etc) para não dar timeout
            return NextResponse.json({ message: "Evento Ignorado" });
        }

    } catch (error: any) {
        console.error("🔴 ERRO NO WEBHOOK:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
