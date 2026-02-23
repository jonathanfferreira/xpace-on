import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Rotas públicas que não precisam de sessão (Ignorar Arquivos Estáticos/API Interna já blindada pelo Next)
    const isPublicRoute =
        request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/register') ||
        request.nextUrl.pathname.startsWith('/checkout') ||
        request.nextUrl.pathname.startsWith('/auth') || // <--- EXCEÇÃO PARA CALLBACK OAuth (Google/Apple)
        request.nextUrl.pathname.startsWith('/api') || // <--- EXCEÇÃO CRÍTICA PARA AS APIS (Checkout Asaas e Webhooks)
        request.nextUrl.pathname === '/' || // Home page
        // Regex simplificada para permitir acesso livre à página dinâmica de perfil "/slug" sem afetar "/dashboard/..."
        /^\/[a-zA-Z0-9_-]+$/.test(request.nextUrl.pathname) && !request.nextUrl.pathname.startsWith('/dashboard') && !request.nextUrl.pathname.startsWith('/api')

    if (!user && !isPublicRoute) {
        // Redireciona usuários não logados para a tela de login
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // --- FEATURE ANTI-PIRATARIA (SINGLE SESSION LOCK) ---
    // Apenas verifica contas válidas protegidas pelo Supabase (Dashboard)
    if (user && !isPublicRoute) {
        const { data: isValidSession } = await supabase.rpc('is_valid_session')

        // Se a sessão expirou por causa de um novo login (outra máquina)
        if (isValidSession === false) {
            await supabase.auth.signOut() // Mata cookies locais
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            url.searchParams.set('reason', 'session_revoked')
            return NextResponse.redirect(url)
        }
    }

    // TODO: Buscar o 'role' do usuário e isolar as rotas
    // Ex: se rotas começam com /os (XPACE OS) e o user.role for 'aluno', redireciona para /app (Consumo).

    return supabaseResponse
}
