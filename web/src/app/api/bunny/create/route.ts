import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: Request) {
    try {
        const cookieStore = cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { cookies: { get: (name) => cookieStore.get(name)?.value } }
        )
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { data: dbUser } = await supabase.from('users').select('role').eq('id', user.id).single()
        const isAuthorized = dbUser?.role === 'professor' || dbUser?.role === 'escola' || dbUser?.role === 'admin'
        if (!isAuthorized) {
            return NextResponse.json({ error: 'Você precisa ser um Criador (Professor/Escola) para fazer upload.' }, { status: 403 })
        }

        const body = await request.json()
        const { title } = body;

        const libraryId = process.env.BUNNY_LIBRARY_ID
        const accessKey = process.env.BUNNY_ACCESS_KEY

        if (!libraryId || !accessKey) {
            return NextResponse.json({ error: 'Integração Bunny.net não configurada no servidor (Library / AccessKey ausentes).' }, { status: 500 })
        }

        // Criar o placeholder do vídeo (Allocating space in the Stream Cloud)
        const response = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos`, {
            method: 'POST',
            headers: {
                'AccessKey': accessKey,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ title: title || 'Nova Aula XPACE' })
        })

        if (!response.ok) {
            const err = await response.text()
            console.error("Bunny API error:", err)
            return NextResponse.json({ error: 'Falha ao pré-alocar vídeo na Bunny.net' }, { status: 500 })
        }

        const data = await response.json()
        const videoId = data.guid;

        // Gerar TUS Authentication Signature para permitir o Upload DIreto do Computador do Usuário para o Data Center
        // Fórmula de Segurança: SHA256(library_id + api_key + expiration_time + video_id)
        const expirationTime = Math.floor(Date.now() / 1000) + (60 * 60 * 24); // Token Válido por 24 horas
        const signatureString = `${libraryId}${accessKey}${expirationTime}${videoId}`;
        const signature = crypto.createHash('sha256').update(signatureString).digest('hex');

        return NextResponse.json({
            videoId,
            libraryId,
            signature,
            expirationTime
        })
    } catch (e: any) {
        console.error("Error creating bunny video:", e)
        return NextResponse.json({ error: e.message || 'Server Exception' }, { status: 500 })
    }
}
