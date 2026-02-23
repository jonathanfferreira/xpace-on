import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const ASAAS_API_URL = process.env.ASAAS_API_URL || "https://sandbox.asaas.com/api/v3";
const ASAAS_API_KEY = process.env.ASAAS_API_KEY;

export async function POST(request: Request) {
    console.log("🟢 INICIANDO POST /api/checkout ... Aguardando Body JSON", ASAAS_API_KEY ? "[API KEY ATIVA]" : "[MOCK MODE]");

    try {
        let body;
        try {
            body = await request.json();
            console.log("📦 PAYLOAD RECEBIDO DO FRONTEND:", body);
        } catch (err) {
            console.error("🔴 ERRO DE PARSE DO JSON DO FRONTEND:", err);
            return NextResponse.json({ error: "Corpo da requisição não é um JSON válido." }, { status: 400 });
        }

        const { name, email, phone, courseId, paymentMethod, creditCard } = body;

        // 1. Inicializar Supabase Client (Admin / Service Role pra salvar Tabela Transactions bypassando RLS)
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use Admin Key to safely insert billing records
            {
                cookies: {
                    getAll() { return cookieStore.getAll(); },
                    setAll() { },
                },
            }
        );

        // MOCK MODE: Se a chave do Asaas não existir no .env, devolvemos success mockado para o front não quebrar
        if (!ASAAS_API_KEY) {
            console.warn("ASAAS_API_KEY não encontrada. Retornando Mock de Sucesso.");
            return NextResponse.json({
                success: true,
                paymentId: "pay_mock_12345",
                status: "PENDING",
                pixQrCodeUrl: paymentMethod === 'pix' ? "https://sandbox.asaas.com/pix/qrcode" : null,
                pixCopiaECola: paymentMethod === 'pix' ? "00020126580014BR.GOV.BCB.PIX0136..." : null,
            });
        }

        // 2. Buscar/Criar Customer no Asaas
        // ... Implementação Real via fetch(ASAAS_API_URL + '/customers')
        let customerId = "";

        const customerRes = await fetch(`${ASAAS_API_URL}/customers?email=${email}`, {
            method: "GET",
            headers: { "access_token": ASAAS_API_KEY }
        });

        const customerData = await customerRes.json();
        if (customerData.data && customerData.data.length > 0) {
            customerId = customerData.data[0].id;
        } else {
            // Cria novo
            const newCustomerRes = await fetch(`${ASAAS_API_URL}/customers`, {
                method: "POST",
                headers: { "access_token": ASAAS_API_KEY, "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, mobilePhone: phone })
            });
            const newCustomer = await newCustomerRes.json();
            customerId = newCustomer.id;
        }

        // 3. Matemática Financeira e Montagem da Cobrança com SPLIT Seguro
        const BASE_PRICE = 349.90; // Hardcoded para Mock do MVP. Requer buscar Tbl `courses`.
        const INTEREST_RATE = 0.0299; // 2.99% a.m Asaas Simulado
        const installments = body.installments || 1;

        // Calcula o Juros Repassado pro Comprador ("Buyer-Paid Interest")
        let finalValue = BASE_PRICE;
        if (paymentMethod === 'credit' && installments > 1) {
            const installmentValue = BASE_PRICE * Math.pow(1 + INTEREST_RATE, installments) / installments;
            finalValue = installmentValue * installments;
        }

        // Split Seguro ("Fixed Value") para blindar Margens
        // Margem do Professor: 90% DE 349.90 = R$ 314,91
        // Margem XPACE.ON: 10% DE 349.90 = R$ 34,99
        // A sobra (finalValue - 349.90) será cobrada de juros e ficará com a Plataforma para cobrir os Cartões.
        const PROFESSOR_FIXED_SPLIT = Number((BASE_PRICE * 0.90).toFixed(2));

        const chargePayload: any = {
            customer: customerId,
            billingType: paymentMethod === 'pix' ? 'PIX' : 'CREDIT_CARD',
            value: Number(finalValue.toFixed(2)),
            dueDate: new Date().toISOString().split("T")[0],
            description: `Inscrição XPACE ON - Treinamento #${courseId}`,
            // Split configurado para FixedValue (Isola o comissionamento do Juros do Cartão)
            /* 
            split: [
              { walletId: "wal_professor", fixedValue: PROFESSOR_FIXED_SPLIT } 
            ]
            */
        };

        if (paymentMethod === 'credit' && creditCard) {
            chargePayload.creditCard = creditCard;
            chargePayload.creditCardHolderInfo = {
                name,
                email,
                cpfCnpj: "00000000000", // Necessário pro Asaas
                postalCode: "00000000",
                addressNumber: "0",
                phone
            };

            // Repassando o número de parcelas configuradas
            if (installments > 1) {
                chargePayload.installmentCount = installments;
                chargePayload.installmentValue = Number((finalValue / installments).toFixed(2));
            }
        }

        // 4. Disparar API de Payments
        const chargeRes = await fetch(`${ASAAS_API_URL}/payments`, {
            method: "POST",
            headers: { "access_token": ASAAS_API_KEY, "Content-Type": "application/json" },
            body: JSON.stringify(chargePayload)
        });

        const chargeData = await chargeRes.json();

        if (!chargeRes.ok) {
            throw new Error(chargeData.errors?.[0]?.description || "Erro ao gerar cobrança no Asaas");
        }

        // 5. Salvar Transação Pendente no Banco de Dados
        // TODO: Criar usuário no Auth se não existir e linkar a transaction

        // 6. Retorno pro Frontend
        if (paymentMethod === 'pix') {
            // Puxar payload do PIX do proprio Payment
            const pixRes = await fetch(`${ASAAS_API_URL}/payments/${chargeData.id}/pixQrCode`, {
                headers: { "access_token": ASAAS_API_KEY }
            });
            const pixData = await pixRes.json();
            console.log("🟦 [ASAAS] PIX DATA RECEIVED:", pixData);

            return NextResponse.json({
                success: true,
                paymentId: chargeData.id,
                status: chargeData.status,
                // Asaas v3 devolve 'encodedImage' como string Base64. Garantindo que não dobre o prefixo.
                pixQrCodeUrl: pixData.encodedImage
                    ? (String(pixData.encodedImage).startsWith('data:image') ? pixData.encodedImage : `data:image/png;base64,${pixData.encodedImage}`)
                    : null,
                pixCopiaECola: pixData.payload,
            });
        }

        return NextResponse.json({
            success: true,
            paymentId: chargeData.id,
            status: chargeData.status
        });

    } catch (error: any) {
        console.error("🟢 ERRO CHECKOUT ASAAS:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
