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

async function verifyLessonOwnership(supabase: any, lessonId: string, userId: string) {
    const { data: lesson } = await supabase
        .from('lessons').select('id, course_id').eq('id', lessonId).single()
    if (!lesson) return null

    const { data: tenant } = await supabase
        .from('tenants').select('id').eq('owner_id', userId).single()
    if (!tenant) return null

    const { data: course } = await supabase
        .from('courses').select('id').eq('id', lesson.course_id).eq('tenant_id', tenant.id).single()
    if (!course) return null

    return lesson
}

// PATCH /api/studio/lessons/[id] — atualizar aula (título, módulo, video_id)
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { supabase, user } = await getSupabaseAndUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const lesson = await verifyLessonOwnership(supabase, id, user.id)
    if (!lesson) return NextResponse.json({ error: 'Aula não encontrada ou sem permissão' }, { status: 404 })

    const body = await request.json()
    const allowed = ['title', 'module_name', 'description', 'video_id', 'order_index']
    const updateData: Record<string, unknown> = {}
    for (const key of allowed) {
        if (key in body) updateData[key] = body[key]
    }

    const { data: updated, error } = await supabase
        .from('lessons')
        .update(updateData)
        .eq('id', id)
        .select('id, module_name, title, description, video_id, order_index')
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ lesson: updated })
}

// DELETE /api/studio/lessons/[id] — excluir aula
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { supabase, user } = await getSupabaseAndUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const lesson = await verifyLessonOwnership(supabase, id, user.id)
    if (!lesson) return NextResponse.json({ error: 'Aula não encontrada ou sem permissão' }, { status: 404 })

    const { error } = await supabase.from('lessons').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
}
