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

// PATCH /api/studio/courses/[id] — toggle publish status
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { supabase, user } = await getSupabaseAndUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await request.json()

    // Verify course belongs to this user's tenant
    const { data: tenant } = await supabase.from('tenants').select('id').eq('owner_id', user.id).single()
    if (!tenant) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })

    const { data: course, error } = await supabase
        .from('courses')
        .update({ is_published: body.is_published, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('tenant_id', tenant.id)
        .select('id, is_published')
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ course })
}

// DELETE /api/studio/courses/[id] — delete a course
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { supabase, user } = await getSupabaseAndUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    // Verify course belongs to this user's tenant
    const { data: tenant } = await supabase.from('tenants').select('id').eq('owner_id', user.id).single()
    if (!tenant) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })

    const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id)
        .eq('tenant_id', tenant.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
}
