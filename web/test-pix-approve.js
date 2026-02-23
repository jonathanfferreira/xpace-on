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

async function approveSandboxAccount() {
    console.log("🟦 [ASAAS] Solicitando aprovação de conta Sandbox...");

    try {
        const res = await fetch(`${ASAAS_API_URL}/sandbox/myAccount/approve`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'access_token': ASAAS_API_KEY
            },
        });

        console.log("STATUS:", res.status, res.statusText);
        const text = await res.text();
        fs.writeFileSync('asaas_approve_log.txt', text);
    } catch (e) {
        console.error("❌ Falha na requisição de aprovação da conta Sandbox:", e);
    }
}

approveSandboxAccount();
