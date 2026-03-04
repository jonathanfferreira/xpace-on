import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// POST /api/courses/enroll — enroll user in a course
export async function POST(request: Request) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll: () => cookieStore.getAll() } }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { course_id } = body

    if (!course_id) {
        return NextResponse.json({ error: 'course_id é obrigatório' }, { status: 400 })
    }

    // Get course info
    const { data: course, error: courseErr } = await supabase
        .from('courses')
        .select('id, price, pricing_type, is_published, tenant_id')
        .eq('id', course_id)
        .single()

    if (courseErr || !course) {
        return NextResponse.json({ error: 'Curso não encontrado' }, { status: 404 })
    }

    if (!course.is_published) {
        return NextResponse.json({ error: 'Este curso não está publicado' }, { status: 400 })
    }

    // Check if already enrolled
    const { data: existing } = await supabase
        .from('enrollments')
        .select('id')
        .eq('course_id', course_id)
        .eq('user_id', user.id)
        .maybeSingle()

    if (existing) {
        return NextResponse.json({ error: 'Você já está matriculado neste curso', enrollment: existing }, { status: 200 })
    }

    // For paid courses, we would redirect to payment first
    // For now, handle free courses and one_time (direct enrollment for testing)
    const isPaid = course.pricing_type !== 'free' && Number(course.price) > 0

    if (isPaid) {
        // TODO: Integrate with ASAAS payment flow
        // For now, return a message that payment is required
        return NextResponse.json({
            error: 'Este curso requer pagamento. Integração de pagamento em breve.',
            requires_payment: true,
            course_id: course.id,
            price: course.price,
        }, { status: 402 })
    }

    // Free enrollment
    const { data: enrollment, error: enrollErr } = await supabase
        .from('enrollments')
        .insert({
            user_id: user.id,
            course_id: course_id,
            tenant_id: course.tenant_id,
            status: 'active',
        })
        .select('id')
        .single()

    if (enrollErr) {
        return NextResponse.json({ error: enrollErr.message }, { status: 500 })
    }

    // Award XP for enrollment
    await supabase.from('user_xp_history').insert({
        user_id: user.id,
        xp_amount: 50,
        source: 'enrollment',
        description: `Matrícula no curso`,
    }).then(() => { })

    return NextResponse.json({ enrollment, message: 'Matrícula realizada com sucesso!' }, { status: 201 })
}
