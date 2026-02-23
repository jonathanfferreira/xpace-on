import fs from 'fs';
import path from 'path';

// Read API Key from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const asaasMatch = envContent.match(/ASAAS_API_KEY=\\?\$([A-Za-z0-9_:-]+)/);

if (!asaasMatch) {
    console.error("❌ Erro: Chave ASAAS_API_KEY não encontrada");
    process.exit(1);
}

const ASAAS_API_KEY = '$' + asaasMatch[1];
const ASAAS_API_URL = 'https://sandbox.asaas.com/api/v3';

async function createWebhook() {
    console.log("🟦 [ASAAS] Configurando Webhook no Sandbox para a Vercel...");

    const payload = {
        name: "Xpace On Vercel Hook",
        url: "https://xpace-on.vercel.app/api/webhooks/asaas",
        email: "fferreira.jonathan@gmail.com",
        enabled: true,
        interrupted: false,
        apiVersion: 3,
        sendType: "SEQUENTIALLY",
        events: ["PAYMENT_RECEIVED", "PAYMENT_CONFIRMED"]
    };

    try {
        const res = await fetch(`${ASAAS_API_URL}/webhooks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'access_token': ASAAS_API_KEY
            },
            body: JSON.stringify(payload)
        });

        console.log("STATUS:", res.status, res.statusText);
        const text = await res.text();
        fs.writeFileSync('asaas_webhook_log.txt', text);
        console.log("🟦 Resposta salva em asaas_webhook_log.txt");

        if (res.ok) {
            console.log("✅ Webhook Configurado com Sucesso apontando para a Vercel!");
        } else {
            console.log("❌ Falha ao criar Webhook. Verifique o log.");
        }
    } catch (e) {
        console.error("❌ Falha na comunicação:", e);
    }
}

createWebhook();
