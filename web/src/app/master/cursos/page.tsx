import { createClient } from '@supabase/supabase-js';
import { BookOpen, Eye, EyeOff, ExternalLink } from 'lucide-react';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getAllCourses() {
    const { data, error } = await supabaseAdmin
        .from('courses')
        .select(`
            id, title, description, price, pricing_type,
            is_published, created_at,
            tenants:tenant_id(name, slug, owner_id,
                users:owner_id(full_name, email)
            )
        `)
        .order('created_at', { ascending: false });

    if (error) return [];

    return (data || []).map((c: any) => ({
        ...c,
        tenant_name: c.tenants?.name || '—',
        tenant_slug: c.tenants?.slug || null,
        owner_name: c.tenants?.users?.full_name || '—',
        owner_email: c.tenants?.users?.email || '—',
    }));
}

async function getStats() {
    const [{ count: total }, { count: published }, { count: draft }] = await Promise.all([
        supabaseAdmin.from('courses').select('id', { count: 'exact', head: true }),
        supabaseAdmin.from('courses').select('id', { count: 'exact', head: true }).eq('is_published', true),
        supabaseAdmin.from('courses').select('id', { count: 'exact', head: true }).eq('is_published', false),
    ]);
    return { total: total || 0, published: published || 0, draft: draft || 0 };
}

export default async function MasterCoursesPage() {
    const [courses, stats] = await Promise.all([getAllCourses(), getStats()]);
    const fmt = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div>
                <h1 className="text-3xl font-display font-bold text-white uppercase tracking-wider mb-2">CATÁLOGO GLOBAL DE CURSOS</h1>
                <p className="text-[#888] font-mono text-sm uppercase tracking-widest">Todos os cursos de todas as escolas e professores</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-5 rounded">
                    <p className="text-[#888] text-xs font-mono uppercase tracking-widest mb-1">Total de Cursos</p>
                    <p className="text-white text-3xl font-bold font-mono">{stats.total}</p>
                </div>
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-5 rounded">
                    <p className="text-[#888] text-xs font-mono uppercase tracking-widest mb-1">Publicados</p>
                    <p className="text-green-400 text-3xl font-bold font-mono">{stats.published}</p>
                </div>
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-5 rounded">
                    <p className="text-[#888] text-xs font-mono uppercase tracking-widest mb-1">Rascunhos</p>
                    <p className="text-yellow-400 text-3xl font-bold font-mono">{stats.draft}</p>
                </div>
            </div>

            {/* Courses table */}
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded overflow-hidden">
                <div className="p-6 border-b border-[#1a1a1a] flex justify-between items-center">
                    <h2 className="text-white font-bold font-heading uppercase tracking-wide">TODOS OS CURSOS</h2>
                    <span className="text-xs text-[#555] font-mono">{courses.length} cursos cadastrados</span>
                </div>

                {courses.length === 0 ? (
                    <div className="p-12 text-center">
                        <BookOpen size={40} className="mx-auto text-[#333] mb-4" />
                        <p className="text-[#555] text-sm">Nenhum curso cadastrado ainda.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#111] text-[#666] text-xs uppercase font-mono tracking-widest">
                                    <th className="p-4 font-normal">Curso</th>
                                    <th className="p-4 font-normal">Escola / Prof.</th>
                                    <th className="p-4 font-normal">Tipo</th>
                                    <th className="p-4 font-normal">Status</th>
                                    <th className="p-4 font-normal text-right">Preço</th>
                                    <th className="p-4 font-normal">Criado em</th>
                                    <th className="p-4 font-normal"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1a1a1a] text-sm font-sans">
                                {courses.map((c: any) => (
                                    <tr key={c.id} className="hover:bg-[#111] transition-colors">
                                        <td className="p-4">
                                            <p className="text-white font-medium">{c.title}</p>
                                            {c.description && (
                                                <p className="text-[#555] text-xs mt-0.5 line-clamp-1">{c.description}</p>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <p className="text-white text-sm">{c.tenant_name}</p>
                                            <p className="text-[#666] text-xs font-mono">{c.owner_email}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border text-[#888] border-[#333] bg-[#111]">
                                                {c.pricing_type === 'subscription' ? 'Assinatura' : 'Avulso'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`flex items-center gap-1.5 text-[10px] font-mono uppercase ${c.is_published ? 'text-green-400' : 'text-[#666]'}`}>
                                                {c.is_published ? <Eye size={12} /> : <EyeOff size={12} />}
                                                {c.is_published ? 'Publicado' : 'Rascunho'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right font-mono font-bold text-white">
                                            R$ {fmt(Number(c.price))}
                                        </td>
                                        <td className="p-4 text-[#666] font-mono text-xs">
                                            {new Date(c.created_at).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="p-4">
                                            {c.tenant_slug && c.is_published && (
                                                <a
                                                    href={`/${c.tenant_slug}`}
                                                    target="_blank"
                                                    className="text-[#555] hover:text-primary transition-colors"
                                                    title="Ver página pública"
                                                >
                                                    <ExternalLink size={14} />
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
