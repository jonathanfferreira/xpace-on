import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { subscriptionCheckoutSchema } from "@/lib/validators";
import { rateLimit, getClientIp } from "@/utils/rate-limit";
import { validateCsrf } from "@/utils/csrf";
import { cookies } from "next/headers";
import { stripe } from "@/lib/stripe";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
    // Rate limiting: 3 tentativas/min por IP
    const ip = getClientIp(request);
    const { limited } = await rateLimit(ip, 3);
    if (limited) {
        return NextResponse.json(
            { error: "Muitas tentativas. Tente novamente em 1 minuto." },
            { status: 429, headers: { "Retry-After": "60" } }
        );
    }

    // CSRF validation
    const csrfError = validateCsrf(request);
    if (csrfError) {
        return NextResponse.json({ error: "Requisição inválida." }, { status: 403 });
    }

    try {
        let rawBody: unknown;
        try {
            rawBody = await request.json();
        } catch {
            return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
        }

        // Zod validation
        const result = subscriptionCheckoutSchema.safeParse(rawBody);
        if (!result.success) {
            return NextResponse.json(
                { error: "Dados inválidos.", details: result.error.flatten().fieldErrors },
                { status: 422 }
            );
        }

        const { name, email, planId } = result.data;
        const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "";

        // 1. Busca o plano
        const { data: plan, error: planError } = await supabaseAdmin
            .from("subscription_plans")
            .select("*, tenants:tenants!tenant_id(stripe_account_id, split_percent)")
            .eq("id", planId)
            .single();

        if (planError || !plan || !plan.is_active) {
            return NextResponse.json({ error: "Plano não encontrado ou inativo." }, { status: 404 });
        }

        const tenant = (plan as any).tenants;
        const stripeAccountId = tenant?.stripe_account_id;
        const splitPercent = tenant?.split_percent || 10;

        // Tracker de Afiliado
        const cookieStore = await cookies();
        const affiliateCode = cookieStore.get("asaas_affiliate_tracker")?.value;

        // 2. Busca ou cria usuário/customer
        let userId: string | null = null;
        let stripeCustomerId: string | null = null;

        const { data: existingUserRow } = await supabaseAdmin
            .from('users')
            .select('id, stripe_customer_id')
            .eq('email', email)
            .single();

        if (existingUserRow) {
            userId = existingUserRow.id;
            stripeCustomerId = existingUserRow.stripe_customer_id;
        }

        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email,
                name,
                metadata: { userId: userId || "" }
            });
            stripeCustomerId = customer.id;
            
            if (userId) {
                await supabaseAdmin.from('users').update({ stripe_customer_id: stripeCustomerId }).eq('id', userId);
            }
        }

        // 3. Garante que o Preço Stripe existe
        let stripePriceId = plan.stripe_price_id;
        if (!stripePriceId) {
            const product = await stripe.products.create({
                name: plan.name,
                metadata: { planId: plan.id }
            });

            const price = await stripe.prices.create({
                product: product.id,
                unit_amount: Math.round(plan.price * 100),
                currency: 'brl',
                recurring: {
                    interval: plan.billing_cycle === 'YEARLY' ? 'year' : 'month',
                }
            });

            stripePriceId = price.id;
            await supabaseAdmin.from('subscription_plans').update({
                stripe_product_id: product.id,
                stripe_price_id: stripePriceId
            }).eq('id', plan.id);
        }

        // 4. Cria Sessão de Assinatura
        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            line_items: [{ price: stripePriceId, quantity: 1 }],
            mode: 'subscription',
            success_url: `${origin}/studio/assinaturas?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/checkout/plan/${planId}?canceled=true`,
            metadata: {
                userId: userId || "",
                planId: planId,
                tenantId: plan.tenant_id,
                affiliateCode: affiliateCode || "",
            },
            subscription_data: {
                // Connect logic for Subscriptions:
                // We use application_fee_percent for recurring payments
                ...(stripeAccountId ? {
                    application_fee_percent: splitPercent,
                    transfer_data: {
                        destination: stripeAccountId,
                    },
                } : {})
            }
        });

        return NextResponse.json({
            success: true,
            url: session.url,
        });

    } catch (error: any) {
        console.error("🔴 SUBSCRIPTION CHECKOUT ERROR:", error);
        return NextResponse.json({ error: error.message || "Erro ao processar assinatura." }, { status: 500 });
    }
}
