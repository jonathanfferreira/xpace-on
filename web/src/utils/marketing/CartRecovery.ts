import { Resend } from 'resend';

export async function sendCartRecoveryEmail(userEmail: string, userName: string, checkoutUrl: string) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("⚠️ Chave da Resend não configurada. E-mail abortado.");
        return;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        await resend.emails.send({
            from: 'XPACE ON <suporte@xpace.on>',
            to: [userEmail],
            subject: '⚠️ Seu treino na XPACE ON ficou pausado na tela de pagamento!',
            html: `
                <div style="background-color: #050505; color: #ffffff; font-family: sans-serif; padding: 40px; text-align: center; border-top: 5px solid #eb00bc;">
                    <h1 style="color: #eb00bc; text-transform: uppercase; font-size: 28px;">OPA, ${userName || 'DANCER'}!</h1>
                    <p style="color: #888888; font-size: 16px; line-height: 1.6; max-width: 500px; margin: 0 auto 30px;">
                        Percebemos que você iniciou o seu plano no <strong style="color:#fff;">Holo-Deck da XPACE ON</strong>, mas o pagamento não foi concluído.
                    </p>
                    
                    <div style="background-color: #111111; padding: 20px; border: 1px solid #333333; border-radius: 8px; max-width: 400px; margin: 0 auto 30px;">
                        <p style="margin: 0; color: #ffffff; font-weight: bold;">Plano Premium (Acesso Antecipado)</p>
                        <p style="margin: 5px 0 0; color: #eb00bc; font-size: 24px; font-weight: bold;">R$ 49,90<span style="font-size: 14px; color: #666;">/mês</span></p>
                    </div>

                    <a href="${checkoutUrl}" style="background-color: #6324b2; color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 4px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">
                        FINALIZAR MEU ACESSO AGORA
                    </a>

                    <p style="margin-top: 40px; font-size: 12px; color: #444444; font-family: monospace;">
                        XPACE ON ENTERTAINMENT LTDA - SISTEMA AUTOMATIZADO
                    </p>
                </div>
            `
        });

        console.log(`[RESEND] 📨 E-mail de Recuperação de Carrinho enviado para: ${userEmail}`);
    } catch (error) {
        console.error(`[RESEND] 🔴 Erro ao enviar e-mail de recuperação:`, error);
    }
}
