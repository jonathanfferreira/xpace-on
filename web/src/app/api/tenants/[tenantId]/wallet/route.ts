import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ASAAS_API_URL = process.env.ASAAS_API_URL || "https://sandbox.asaas.com/api/v3";
const ASAAS_API_KEY = process.env.ASAAS_API_KEY;

// Admin client to bypass RLS for secure operations
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request, { params }: { params: Promise<{ tenantId: string }> }) {
    const { tenantId } = await params;

    if (!ASAAS_API_KEY) {
        return NextResponse.json({ error: "ASAAS_API_KEY não configurada." }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { pixKey, bankCode, bankAgency, bankAccount, companyType, documentCpfCnpj, name, email, phone } = body;

        if (!documentCpfCnpj || !name || !email) {
            return NextResponse.json({ error: "Dados cadastrais incompletos (Nome, Email, CPF/CNPJ)." }, { status: 400 });
        }

        // 1. Cria a conta base no Asaas (Subconta / White Label)
        const accountPayload = {
            name,
            email,
            loginEmail: email, // Usando o mesmo email
            cpfCnpj: documentCpfCnpj,
            companyType: companyType || (documentCpfCnpj.length > 11 ? "LIMITED" : undefined),
            mobilePhone: phone || undefined,
            // Necessita capturar endereço também em produção. Passando hardcoded para fins de ativação Sandbox.
            postalCode: "01001-000",
            address: "Praça da Sé",
            addressNumber: "1",
            province: "Sé",
        };

        const createAccountRes = await fetch(`${ASAAS_API_URL}/accounts`, {
            method: "POST",
            headers: {
                "access_token": ASAAS_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(accountPayload)
        });

        const accountData = await createAccountRes.json();

        if (!createAccountRes.ok) {
            console.error("Asaas Create Account Error:", accountData);
            return NextResponse.json({ error: accountData.errors?.[0]?.description || "Erro ao criar subconta no Asaas" }, { status: 400 });
        }

        const asaasWalletId = accountData.walletId || accountData.id;

        // 2. Registra o ID da subconta recém-criada no Supabase
        await supabaseAdmin
            .from('tenants')
            .update({
                asaas_wallet_id: asaasWalletId,
                pix_key: pixKey || null,
                bank_code: bankCode || null,
                bank_agency: bankAgency || null,
                bank_account: bankAccount || null
            })
            .eq('id', tenantId);

        // 3. Opcional: Registra log local em asaas_wallets
        await supabaseAdmin.from('asaas_wallets').insert({
            tenant_id: tenantId,
            asaas_customer_id: accountData.id,
            asaas_wallet_id: asaasWalletId,
            company_type: companyType
        });

        return NextResponse.json({
            success: true,
            walletId: asaasWalletId,
            message: "Subconta criada com sucesso para Split automático."
        });

    } catch (error: any) {
        console.error("🔴 WALLET CREATION ERROR:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
