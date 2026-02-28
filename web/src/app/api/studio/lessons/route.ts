import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

async function getSupabaseAndUser() {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll: () => cookieStore.getAll() } }
    )
    const { data: { user } } = await supabase.auth.getUser()
    return { supabase, user }
}

// POST /api/studio/lessons — criar aula e vincular ao curso
export async function POST(request: Request) {
    const { supabase, user } = await getSupabaseAndUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { course_id, module_name, title, video_id, description, order_index } = body

    if (!course_id || !module_name || !title) {
        return NextResponse.json({ error: 'course_id, module_name e title são obrigatórios' }, { status: 400 })
    }

    // Verifica se o curso pertence ao tenant do usuário
    const { data: tenant } = await supabase.from('tenants').select('id').eq('owner_id', user.id).single()
    if (!tenant) return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })

    const { data: course } = await supabase
        .from('courses').select('id').eq('id', course_id).eq('tenant_id', tenant.id).single()
    if (!course) return NextResponse.json({ error: 'Curso não encontrado ou sem permissão' }, { status: 404 })

    // Calcula order_index automático se não informado
    let idx = order_index ?? null
    if (idx === null || idx === undefined) {
        const { count } = await supabase
            .from('lessons')
            .select('id', { count: 'exact', head: true })
            .eq('course_id', course_id)
            .eq('module_name', module_name)
        idx = count ?? 0
    }

    const { data: lesson, error } = await supabase
        .from('lessons')
        .insert({
            course_id,
            module_name: module_name.trim(),
            title: title.trim(),
            description: description?.trim() || null,
            video_id: video_id || null,
            order_index: idx,
        })
        .select('id, module_name, title, description, video_id, order_index')
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ lesson }, { status: 201 })
}
