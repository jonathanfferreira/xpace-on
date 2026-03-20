import crypto from 'crypto';

/**
 * Gera uma URL assinada digitalmente para o Bunny Stream HLS.
 * Isso impede que scripts extraiam o .m3u8 e rodem em players de terceiros (pirataria).
 * 
 * @param videoId ID do vídeo no Bunny.net
 * @param userIp IP do usuário (Opcional, mas trava o token a 1 única conexão se informado)
 * @param expiresInSeconds Tempo de vida do token (Padrão 6h para masterclasses longas)
 */
export function generateBunnyTokenizedUrl(videoId: string, userIp: string = "", expiresInSeconds: number = 21600): string {
    // Fallback de hostname tirado do print do BunnyCDN do usuário para garantir que funcione mesmo sem ENV
    const hostname = process.env.NEXT_PUBLIC_BUNNY_CDN_HOSTNAME || process.env.BUNNY_CDN_HOSTNAME || process.env.NEXT_PUBLIC_BUNNY_STREAM_CDN_URL || 'vz-98a0e7c0-529.b-cdn.net';
    const securityKey = process.env.BUNNY_TOKEN_AUTH_KEY || process.env.BUNNY_SECURITY_KEY || process.env.BUNNY_API_KEY; 

    const cleanHostname = hostname.replace(/^https?:\/\//, '');

    if (!securityKey) {
        console.warn("Bunny CDN security key missing, returning insecure URL. Se a proteção por token estiver ativada na Bunny, o vídeo dará erro 403.");
        return `https://${cleanHostname}/${videoId}/playlist.m3u8`;
    }

    const expirationTime = Math.round(Date.now() / 1000) + expiresInSeconds;

    // A assinatura do Bunny Stream = SHA256(securityKey + videoId + expirationTime + userIp)
    const hashableBase = `${securityKey}${videoId}${expirationTime}${userIp}`;
    const hash = crypto.createHash('sha256').update(hashableBase).digest('hex');

    // Retorna URL protegida - Bunny Stream Token Auth usa "?token=X&expires=Y" na query string!
    const tokenizedUrl = `https://${cleanHostname}/${videoId}/playlist.m3u8?token=${hash}&expires=${expirationTime}`;
    return tokenizedUrl;
}
