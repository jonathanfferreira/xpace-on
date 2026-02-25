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

    // --- FEATURE ANTI-PIRATARIA E FIREWALL (RBAC) ---
    if (user && !isPublicRoute) {

        const isMasterRoute = request.nextUrl.pathname.startsWith('/master')
        const isStudioRoute = request.nextUrl.pathname.startsWith('/studio')

        // Apenas rodar Queries no banco se for estritamente necessário (Rotas Premium)
        if (isMasterRoute || isStudioRoute) {

            // Busca a Role Segura no Banco apenas para as rotas bloqueadas
            const { data: dbUser, error } = await supabase.from('users').select('role').eq('id', user.id).single()

            if (!error) {
                const role = dbUser?.role || 'aluno'

                // Proteção Nível Supremo: Apenas o dono
                if (isMasterRoute && role !== 'admin') {
                    const url = request.nextUrl.clone()
                    url.pathname = '/dashboard'
                    return NextResponse.redirect(url)
                }

                // Proteção Inquilinos: Apenas Escolas e Admin
                if (isStudioRoute && role !== 'escola' && role !== 'professor' && role !== 'admin') {
                    const url = request.nextUrl.clone()
                    url.pathname = '/dashboard'
                    return NextResponse.redirect(url)
                }
            } else {
                // Em caso de falha de conexão no Edge (Network), expulsa por segurança
                const url = request.nextUrl.clone()
                url.pathname = '/dashboard'
                return NextResponse.redirect(url)
            }
        }

        // Single Session Lock (Anti-Pirataria) - Temporariamente desabilitado para debug de Rotas no Next.js
        /*
        const { data: isValidSession } = await supabase.rpc('is_valid_session')
        if (isValidSession === false) {
            await supabase.auth.signOut()
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            url.searchParams.set('reason', 'session_revoked')
            return NextResponse.redirect(url)
        }
        */
    }

    return supabaseResponse
}
